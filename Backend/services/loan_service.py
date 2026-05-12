"""Loan service"""
from datetime import datetime
from database import db
from models import Loan, User

class LoanService:
    """Service for loan operations"""
    
    @staticmethod
    def apply_for_loan(user_id, amount, loan_term=12):
        """Apply for a loan"""
        user = User.query.get(user_id)
        if not user:
            return None, "User not found"
        
        # Calculate interest rate based on user profile
        interest_rate = LoanService.calculate_interest_rate(user)
        
        try:
            loan = Loan(
                user_id=user_id,
                amount=amount,
                interest_rate=interest_rate,
                loan_term=loan_term,
                status='pending'
            )
            
            # Calculate monthly payment
            loan.monthly_payment = loan.calculate_monthly_payment()
            
            db.session.add(loan)
            db.session.commit()
            
            return loan.to_dict(), None
        except Exception as e:
            db.session.rollback()
            return None, f"Failed to apply for loan: {str(e)}"
    
    @staticmethod
    def calculate_interest_rate(user):
        """Calculate interest rate based on user credit profile"""
        # Base rate
        base_rate = 5.0
        
        # Adjust based on transaction history
        from models import Transaction
        transaction_count = Transaction.query.filter(
            Transaction.sender_account_id.in_(
                [acc.id for acc in user.accounts]
            )
        ).count()
        
        if transaction_count > 50:
            return base_rate - 1.0  # Discount for good history
        elif transaction_count < 5:
            return base_rate + 2.0  # Premium for new users
        
        return base_rate
    
    @staticmethod
    def approve_loan(loan_id, admin_id=None):
        """Approve loan application (admin)"""
        loan = Loan.query.get(loan_id)
        if not loan:
            return None, "Loan not found"
        
        if loan.status != 'pending':
            return None, f"Loan is already {loan.status}"
        
        try:
            loan.status = 'approved'
            loan.approved_at = datetime.utcnow()
            db.session.commit()
            return loan.to_dict(), None
        except Exception as e:
            db.session.rollback()
            return None, f"Failed to approve loan: {str(e)}"
    
    @staticmethod
    def reject_loan(loan_id, reason, admin_id=None):
        """Reject loan application (admin)"""
        loan = Loan.query.get(loan_id)
        if not loan:
            return None, "Loan not found"
        
        if loan.status != 'pending':
            return None, f"Loan is already {loan.status}"
        
        try:
            loan.status = 'rejected'
            loan.reason = reason
            db.session.commit()
            return loan.to_dict(), None
        except Exception as e:
            db.session.rollback()
            return None, f"Failed to reject loan: {str(e)}"
    
    @staticmethod
    def get_user_loans(user_id):
        """Get all loans for a user"""
        loans = Loan.query.filter_by(user_id=user_id).all()
        return [loan.to_dict() for loan in loans], None
    
    @staticmethod
    def get_loan(loan_id):
        """Get single loan"""
        loan = Loan.query.get(loan_id)
        if not loan:
            return None, "Loan not found"
        return loan.to_dict(), None
