from datetime import datetime
from database import db

class FraudAlert(db.Model):
    """Fraud alert model for tracking suspicious transactions"""
    __tablename__ = 'fraud_alerts'
    
    id = db.Column(db.Integer, primary_key=True)
    transaction_id = db.Column(db.Integer, db.ForeignKey('transactions.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    risk_level = db.Column(db.String(20), nullable=False)  # low, medium, high, critical
    reason = db.Column(db.String(255), nullable=False)
    is_reviewed = db.Column(db.Boolean, default=False)
    action_taken = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    
    def to_dict(self):
        """Convert fraud alert to dictionary"""
        return {
            'id': self.id,
            'transaction_id': self.transaction_id,
            'user_id': self.user_id,
            'risk_level': self.risk_level,
            'reason': self.reason,
            'is_reviewed': self.is_reviewed,
            'action_taken': self.action_taken,
            'created_at': self.created_at.isoformat()
        }
    
    def __repr__(self):
        return f'<FraudAlert {self.id}>'
