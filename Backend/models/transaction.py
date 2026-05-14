from datetime import datetime
from database import db

class Transaction(db.Model):
    """Transaction model for tracking money transfers with unique transaction IDs"""
    __tablename__ = 'transactions'
    
    id = db.Column(db.Integer, primary_key=True)
    transaction_id = db.Column(db.String(50), unique=True, nullable=False, index=True)  # TXN202605140001
    sender_account_id = db.Column(db.Integer, db.ForeignKey('accounts.id'), nullable=True)
    receiver_account_id = db.Column(db.Integer, db.ForeignKey('accounts.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    transaction_type = db.Column(db.String(50), nullable=False)  # transfer, deposit, withdrawal
    description = db.Column(db.String(255))
    status = db.Column(db.String(20), default='completed', index=True)  # pending, completed, failed, reversed
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    reference_id = db.Column(db.String(50), unique=True, nullable=False)  # Kept for backward compatibility
    
    # Relationships
    fraud_alerts = db.relationship('FraudAlert', backref='transaction', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self, viewer_account_id=None):
        """Convert transaction to dictionary"""
        # Determine if this is a debit or credit from viewer's perspective
        is_debit = viewer_account_id and self.sender_account_id == viewer_account_id
        is_credit = viewer_account_id and self.receiver_account_id == viewer_account_id
        
        return {
            'id': self.id,
            'transaction_id': self.transaction_id,
            'sender_account_id': self.sender_account_id,
            'receiver_account_id': self.receiver_account_id,
            'amount': self.amount,
            'transaction_type': self.transaction_type,
            'description': self.description,
            'status': self.status,
            'timestamp': self.timestamp.isoformat(),
            'reference_id': self.reference_id,
            'is_debit': is_debit,
            'is_credit': is_credit,
            'display_amount': -self.amount if is_debit else self.amount if is_credit else self.amount
        }
    
    def __repr__(self):
        return f'<Transaction {self.transaction_id}>'
