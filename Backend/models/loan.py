from datetime import datetime
from database import db

class Loan(db.Model):
    """Loan model for tracking loans"""
    __tablename__ = 'loans'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    interest_rate = db.Column(db.Float, default=5.0)  # percentage
    loan_term = db.Column(db.Integer, default=12)  # months
    status = db.Column(db.String(20), default='pending')  # pending, approved, rejected, active, closed
    reason = db.Column(db.String(255))
    monthly_payment = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    approved_at = db.Column(db.DateTime)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def calculate_monthly_payment(self):
        """Calculate monthly payment using amortization formula"""
        if self.interest_rate == 0:
            return self.amount / self.loan_term
        
        monthly_rate = self.interest_rate / 100 / 12
        n_payments = self.loan_term
        payment = (self.amount * monthly_rate * (1 + monthly_rate) ** n_payments) / \
                  ((1 + monthly_rate) ** n_payments - 1)
        return round(payment, 2)
    
    def to_dict(self):
        """Convert loan to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'amount': self.amount,
            'interest_rate': self.interest_rate,
            'loan_term': self.loan_term,
            'monthly_payment': self.monthly_payment,
            'status': self.status,
            'reason': self.reason,
            'created_at': self.created_at.isoformat(),
            'approved_at': self.approved_at.isoformat() if self.approved_at else None,
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        return f'<Loan {self.id}>'
