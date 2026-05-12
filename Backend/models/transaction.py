from datetime import datetime
from database import db

class Transaction(db.Model):
    """Transaction model for tracking money transfers"""
    __tablename__ = 'transactions'
    
    id = db.Column(db.Integer, primary_key=True)
    sender_account_id = db.Column(db.Integer, db.ForeignKey('accounts.id'))
    receiver_account_id = db.Column(db.Integer, db.ForeignKey('accounts.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    transaction_type = db.Column(db.String(50), nullable=False)  # transfer, deposit, withdrawal
    description = db.Column(db.String(255))
    status = db.Column(db.String(20), default='completed')  # pending, completed, failed, reversed
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    reference_id = db.Column(db.String(50), unique=True, nullable=False)
    
    # Relationships
    fraud_alerts = db.relationship('FraudAlert', backref='transaction', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        """Convert transaction to dictionary"""
        return {
            'id': self.id,
            'sender_account_id': self.sender_account_id,
            'receiver_account_id': self.receiver_account_id,
            'amount': self.amount,
            'transaction_type': self.transaction_type,
            'description': self.description,
            'status': self.status,
            'timestamp': self.timestamp.isoformat(),
            'reference_id': self.reference_id
        }
    
    def __repr__(self):
        return f'<Transaction {self.reference_id}>'
