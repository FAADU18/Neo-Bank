"""Account service"""
from database import db
from models import Account, User

class AccountService:
    """Service for account operations"""
    
    @staticmethod
    def get_user_accounts(user_id):
        """Get all accounts for a user"""
        accounts = Account.query.filter_by(user_id=user_id).all()
        return [acc.to_dict() for acc in accounts], None
    
    @staticmethod
    def get_account(account_id):
        """Get account by ID"""
        account = Account.query.get(account_id)
        if not account:
            return None, "Account not found"
        return account.to_dict(), None
    
    @staticmethod
    def get_account_by_number(account_number):
        """Get account by account number"""
        account = Account.query.filter_by(account_number=account_number).first()
        if not account:
            return None, "Account not found"
        return account, None
    
    @staticmethod
    def get_balance(account_id):
        """Get account balance"""
        account = Account.query.get(account_id)
        if not account:
            return None, "Account not found"
        return {
            'account_number': account.account_number,
            'balance': account.balance,
            'account_type': account.account_type,
            'status': account.status
        }, None
    
    @staticmethod
    def create_account(user_id, account_type='savings', initial_balance=0.0):
        """Create new account for user"""
        user = User.query.get(user_id)
        if not user:
            return None, "User not found"
        
        try:
            account = Account(
                user_id=user_id,
                account_number=Account.generate_account_number(),
                account_type=account_type,
                balance=initial_balance,
                status='active'
            )
            db.session.add(account)
            db.session.commit()
            return account.to_dict(), None
        except Exception as e:
            db.session.rollback()
            return None, f"Failed to create account: {str(e)}"
    
    @staticmethod
    def freeze_account(account_id):
        """Freeze an account (admin action)"""
        account = Account.query.get(account_id)
        if not account:
            return None, "Account not found"
        
        try:
            account.status = 'frozen'
            db.session.commit()
            return account.to_dict(), None
        except Exception as e:
            db.session.rollback()
            return None, f"Failed to freeze account: {str(e)}"
