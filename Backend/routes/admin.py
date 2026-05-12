"""Admin routes"""
from flask import Blueprint, request
from models import User, Account, FraudAlert, Notification
from services import AccountService
from utils.response import success_response, error_response
from middleware import admin_required
from database import db

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

@admin_bp.route('/users', methods=['GET'])
@admin_required
def get_users(current_user_id):
    """Get all users (admin)"""
    users = User.query.all()
    return success_response("Users retrieved", {
        'users': [u.to_dict() for u in users],
        'total': len(users)
    })

@admin_bp.route('/fraud-alerts', methods=['GET'])
@admin_required
def get_fraud_alerts(current_user_id):
    """Get all fraud alerts (admin)"""
    alerts = FraudAlert.query.all()
    return success_response("Fraud alerts retrieved", {
        'alerts': [a.to_dict() for a in alerts],
        'total': len(alerts)
    })

@admin_bp.route('/fraud-alerts/<int:alert_id>/review', methods=['POST'])
@admin_required
def review_fraud_alert(current_user_id, alert_id):
    """Review fraud alert (admin)"""
    data = request.get_json() or {}
    action = data.get('action', 'approve')  # approve, block
    
    alert = FraudAlert.query.get(alert_id)
    if not alert:
        return error_response("Alert not found", status_code=404)
    
    try:
        alert.is_reviewed = True
        alert.action_taken = action
        
        # If blocking, freeze the account
        if action == 'block':
            transaction = alert.transaction
            if transaction and transaction.sender_account_id:
                account = Account.query.get(transaction.sender_account_id)
                if account:
                    result, error = AccountService.freeze_account(account.id)
                    if not error:
                        alert.action_taken = f"blocked-account-{account.id}"
        
        db.session.commit()
        
        return success_response("Alert reviewed", alert.to_dict())
    except Exception as e:
        db.session.rollback()
        return error_response(f"Review failed: {str(e)}", status_code=400)

@admin_bp.route('/accounts/<int:account_id>/freeze', methods=['POST'])
@admin_required
def freeze_account(current_user_id, account_id):
    """Freeze account (admin)"""
    result, error = AccountService.freeze_account(account_id)
    if error:
        return error_response(error, status_code=404)
    
    return success_response("Account frozen", result)

@admin_bp.route('/user/<int:user_id>/deactivate', methods=['POST'])
@admin_required
def deactivate_user(current_user_id, user_id):
    """Deactivate user account (admin)"""
    if user_id == current_user_id:
        return error_response("Cannot deactivate yourself", status_code=400)
    
    user = User.query.get(user_id)
    if not user:
        return error_response("User not found", status_code=404)
    
    try:
        user.is_active = False
        db.session.commit()
        return success_response("User deactivated", user.to_dict())
    except Exception as e:
        db.session.rollback()
        return error_response(f"Deactivation failed: {str(e)}", status_code=400)

@admin_bp.route('/dashboard', methods=['GET'])
@admin_required
def admin_dashboard(current_user_id):
    """Admin dashboard statistics"""
    total_users = User.query.count()
    total_accounts = Account.query.count()
    pending_loans = db.session.query(db.func.count()).filter_by(status='pending')[0][0]
    unreviewed_alerts = FraudAlert.query.filter_by(is_reviewed=False).count()
    
    return success_response("Dashboard stats", {
        'total_users': total_users,
        'total_accounts': total_accounts,
        'pending_loans': pending_loans,
        'unreviewed_fraud_alerts': unreviewed_alerts
    })
