from datetime import datetime
from database import db
import random

class Account(db.Model):
    """Bank account model"""
    __tablename__ = 'accounts'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    account_number = db.Column(db.String(20), unique=True, nullable=False, index=True)
    balance = db.Column(db.Float, default=0.0)
    account_type = db.Column(db.String(50), default='savings')  # savings, checking, business
    status = db.Column(db.String(20), default='active')  # active, frozen, closed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    sent_transactions = db.relationship('Transaction', foreign_keys='Transaction.sender_account_id', backref='sender', lazy=True)
    received_transactions = db.relationship('Transaction', foreign_keys='Transaction.receiver_account_id', backref='receiver', lazy=True)
    
    @staticmethod
    def generate_account_number():
        """Generate unique account number"""
        return ''.join([str(random.randint(0, 9)) for _ in range(12)])
    
    def to_dict(self):
        """Convert account to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'account_number': self.account_number,
            'balance': self.balance,
            'account_type': self.account_type,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        return f'<Account {self.account_number}>'
