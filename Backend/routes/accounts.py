"""Account routes"""
from flask import Blueprint, request
from services import AccountService
from utils.response import success_response, error_response
from middleware import token_required

account_bp = Blueprint('accounts', __name__, url_prefix='/api/accounts')

@account_bp.route('/', methods=['GET'])
@token_required
def get_accounts(current_user_id):
    """Get all accounts for current user"""
    accounts, error = AccountService.get_user_accounts(current_user_id)
    if error:
        return error_response(error, status_code=404)
    return success_response("Accounts retrieved", {'accounts': accounts})

@account_bp.route('/<int:account_id>', methods=['GET'])
@token_required
def get_account(current_user_id, account_id):
    """Get specific account"""
    account, error = AccountService.get_account(account_id)
    if error:
        return error_response(error, status_code=404)
    
    # Verify ownership
    if account.get('user_id') != current_user_id:
        return error_response("Unauthorized access", status_code=403)
    
    return success_response("Account retrieved", account)

@account_bp.route('/<int:account_id>/balance', methods=['GET'])
@token_required
def get_balance(current_user_id, account_id):
    """Get account balance"""
    account, _ = AccountService.get_account(account_id)
    if not account:
        return error_response("Account not found", status_code=404)
    
    if account.get('user_id') != current_user_id:
        return error_response("Unauthorized access", status_code=403)
    
    balance_info, error = AccountService.get_balance(account_id)
    if error:
        return error_response(error, status_code=404)
    return success_response("Balance retrieved", balance_info)

@account_bp.route('/', methods=['POST'])
@token_required
def create_account(current_user_id):
    """Create new account"""
    data = request.get_json() or {}
    
    account_type = data.get('account_type', 'savings')
    initial_balance = float(data.get('initial_balance', 0))
    
    result, error = AccountService.create_account(current_user_id, account_type, initial_balance)
    if error:
        return error_response(error, status_code=400)
    
    return success_response("Account created successfully", result, 201)
