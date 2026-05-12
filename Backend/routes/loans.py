"""Loan routes"""
from flask import Blueprint, request
from services import LoanService
from utils.response import success_response, error_response
from middleware import token_required, admin_required

loan_bp = Blueprint('loans', __name__, url_prefix='/api/loans')

@loan_bp.route('/apply', methods=['POST'])
@token_required
def apply_loan(current_user_id):
    """Apply for a loan"""
    data = request.get_json() or {}
    
    if 'amount' not in data:
        return error_response("Loan amount required", status_code=400)
    
    loan_term = data.get('loan_term', 12)
    
    result, error = LoanService.apply_for_loan(current_user_id, float(data['amount']), loan_term)
    if error:
        return error_response(error, status_code=400)
    
    return success_response("Loan application submitted", result, 201)

@loan_bp.route('/my-loans', methods=['GET'])
@token_required
def get_my_loans(current_user_id):
    """Get all loans for current user"""
    loans, error = LoanService.get_user_loans(current_user_id)
    if error:
        return error_response(error, status_code=404)
    
    return success_response("Loans retrieved", {'loans': loans})

@loan_bp.route('/<int:loan_id>', methods=['GET'])
@token_required
def get_loan(current_user_id, loan_id):
    """Get loan details"""
    result, error = LoanService.get_loan(loan_id)
    if error:
        return error_response(error, status_code=404)
    
    # Verify ownership
    if result.get('user_id') != current_user_id:
        return error_response("Unauthorized", status_code=403)
    
    return success_response("Loan retrieved", result)

@loan_bp.route('/<int:loan_id>/approve', methods=['POST'])
@admin_required
def approve_loan(current_user_id, loan_id):
    """Approve loan application (admin)"""
    result, error = LoanService.approve_loan(loan_id, current_user_id)
    if error:
        return error_response(error, status_code=400)
    
    return success_response("Loan approved", result)

@loan_bp.route('/<int:loan_id>/reject', methods=['POST'])
@admin_required
def reject_loan(current_user_id, loan_id):
    """Reject loan application (admin)"""
    data = request.get_json() or {}
    reason = data.get('reason', 'Application rejected')
    
    result, error = LoanService.reject_loan(loan_id, reason, current_user_id)
    if error:
        return error_response(error, status_code=400)
    
    return success_response("Loan rejected", result)
