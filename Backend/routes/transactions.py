"""Transaction routes"""
from flask import Blueprint, request
from services import TransactionService
from utils.response import success_response, error_response
from middleware import token_required
from models import Account

transaction_bp = Blueprint('transactions', __name__, url_prefix='/api/transactions')

@transaction_bp.route('/transfer', methods=['POST'])
@token_required
def transfer(current_user_id):
    """Transfer funds between accounts"""
    data = request.get_json() or {}
    
    required_fields = ['sender_account_id', 'receiver_account_number', 'amount']
    if not all(field in data for field in required_fields):
        return error_response("Missing required fields", status_code=400)
    
    # Verify sender account belongs to user
    sender = Account.query.get(data['sender_account_id'])
    if not sender or sender.user_id != current_user_id:
        return error_response("Unauthorized", status_code=403)
    
    result, error = TransactionService.transfer_funds(
        data['sender_account_id'],
        data['receiver_account_number'],
        float(data['amount']),
        data.get('description', '')
    )
    
    if error:
        return error_response(error, status_code=400)
    
    return success_response("Transfer successful", result, 201)

@transaction_bp.route('/<int:account_id>', methods=['GET'])
@token_required
def get_transactions(current_user_id, account_id):
    """Get transaction history for account"""
    # Verify account ownership
    account = Account.query.get(account_id)
    if not account or account.user_id != current_user_id:
        return error_response("Unauthorized", status_code=403)
    
    limit = request.args.get('limit', 50, type=int)
    offset = request.args.get('offset', 0, type=int)
    
    transactions, error = TransactionService.get_transaction_history(account_id, limit, offset)
    if error:
        return error_response(error, status_code=404)
    
    return success_response("Transactions retrieved", {'transactions': transactions})

@transaction_bp.route('/<int:transaction_id>', methods=['GET'])
@token_required
def get_transaction(current_user_id, transaction_id):
    """Get single transaction details"""
    result, error = TransactionService.get_transaction(transaction_id)
    if error:
        return error_response(error, status_code=404)
    
    # Verify user is involved in transaction
    transaction = result
    sender = Account.query.get(transaction.get('sender_account_id'))
    receiver = Account.query.get(transaction.get('receiver_account_id'))
    
    if not sender or not receiver:
        return error_response("Transaction details invalid", status_code=500)
    
    if sender.user_id != current_user_id and receiver.user_id != current_user_id:
        return error_response("Unauthorized", status_code=403)
    
    return success_response("Transaction retrieved", result)
