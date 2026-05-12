"""Transaction service with fraud detection"""
from datetime import datetime, timedelta
from database import db
from models import Transaction, Account, FraudAlert, Notification
from utils import generate_reference_id
from utils.validation import validate_amount

class TransactionService:
    """Service for transaction operations"""
    
    # Fraud detection thresholds
    HIGH_AMOUNT_THRESHOLD = 50000
    RAPID_TRANSFER_THRESHOLD = 5  # transfers within 5 minutes
    DAILY_LIMIT = 500000
    
    @staticmethod
    def transfer_funds(sender_account_id, receiver_account_number, amount, description=""):
        """Transfer funds between accounts with fraud detection"""
        # Validate amount
        is_valid, error = validate_amount(amount)
        if not is_valid:
            return None, error
        
        try:
            # Get sender account
            sender_account = Account.query.get(sender_account_id)
            if not sender_account:
                return None, "Sender account not found"
            
            if sender_account.status != 'active':
                return None, f"Sender account is {sender_account.status}"
            
            # Get receiver account
            receiver_account, error = TransactionService.get_account_by_number(receiver_account_number)
            if error:
                return None, error
            
            if receiver_account.status != 'active':
                return None, f"Receiver account is {receiver_account.status}"
            
            # Validate balance
            if sender_account.balance < amount:
                return None, "Insufficient balance"
            
            # Create transaction
            reference_id = generate_reference_id()
            transaction = Transaction(
                sender_account_id=sender_account_id,
                receiver_account_id=receiver_account.id,
                amount=amount,
                transaction_type='transfer',
                description=description,
                status='pending',
                reference_id=reference_id
            )
            
            # Check for fraud
            fraud_result = TransactionService.check_fraud(sender_account, amount)
            if fraud_result['flagged']:
                transaction.status = 'pending'  # Hold for review
                fraud_alert = FraudAlert(
                    transaction_id=None,  # Will be set after transaction is committed
                    user_id=sender_account.user_id,
                    risk_level=fraud_result['risk_level'],
                    reason=fraud_result['reason']
                )
                db.session.add(fraud_alert)
            
            # Update balances
            sender_account.balance -= amount
            receiver_account.balance += amount
            
            db.session.add(transaction)
            db.session.flush()
            
            # Update fraud alert with transaction ID
            if fraud_result['flagged']:
                fraud_alert.transaction_id = transaction.id
            
            db.session.commit()
            
            # Create notification for receiver
            notification = Notification(
                user_id=receiver_account.user_id,
                title="Money Received",
                message=f"You received ₹{amount:,.2f} from account {sender_account.account_number}",
                notification_type="success"
            )
            db.session.add(notification)
            db.session.commit()
            
            return transaction.to_dict(), None
        
        except Exception as e:
            db.session.rollback()
            return None, f"Transfer failed: {str(e)}"
    
    @staticmethod
    def check_fraud(account, amount):
        """Check for fraudulent activity"""
        fraud_detected = False
        risk_level = 'low'
        reason = ''
        
        # Check 1: High amount transfer
        if amount > TransactionService.HIGH_AMOUNT_THRESHOLD:
            fraud_detected = True
            risk_level = 'high'
            reason = f"Large transfer amount ₹{amount:,.2f} exceeds threshold"
        
        # Check 2: Rapid transfers (multiple transfers in short time)
        recent_transfers = Transaction.query.filter(
            Transaction.sender_account_id == account.id,
            Transaction.timestamp >= datetime.utcnow() - timedelta(minutes=5)
        ).count()
        
        if recent_transfers >= TransactionService.RAPID_TRANSFER_THRESHOLD:
            fraud_detected = True
            risk_level = 'critical'
            reason = f"Multiple rapid transfers detected ({recent_transfers} transfers in 5 minutes)"
        
        # Check 3: Daily limit
        daily_spent = db.session.query(db.func.sum(Transaction.amount)).filter(
            Transaction.sender_account_id == account.id,
            Transaction.timestamp >= datetime.utcnow() - timedelta(days=1),
            Transaction.status == 'completed'
        ).scalar() or 0
        
        if daily_spent + amount > TransactionService.DAILY_LIMIT:
            fraud_detected = True
            risk_level = 'medium'
            reason = f"Daily transfer limit exceeded (₹{daily_spent + amount:,.2f} > ₹{TransactionService.DAILY_LIMIT:,.2f})"
        
        return {
            'flagged': fraud_detected,
            'risk_level': risk_level,
            'reason': reason
        }
    
    @staticmethod
    def get_account_by_number(account_number):
        """Get account by account number"""
        account = Account.query.filter_by(account_number=account_number).first()
        if not account:
            return None, "Receiver account not found"
        return account, None
    
    @staticmethod
    def get_transaction_history(account_id, limit=50, offset=0):
        """Get transaction history for an account"""
        account = Account.query.get(account_id)
        if not account:
            return None, "Account not found"
        
        # Get both sent and received transactions
        sent = Transaction.query.filter_by(sender_account_id=account_id).all()
        received = Transaction.query.filter_by(receiver_account_id=account_id).all()
        
        transactions = sorted(sent + received, key=lambda x: x.timestamp, reverse=True)
        return [t.to_dict() for t in transactions[offset:offset+limit]], None
    
    @staticmethod
    def get_transaction(transaction_id):
        """Get single transaction"""
        transaction = Transaction.query.get(transaction_id)
        if not transaction:
            return None, "Transaction not found"
        return transaction.to_dict(), None
