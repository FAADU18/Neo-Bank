"""Utility functions initialization"""
import uuid
from datetime import datetime
from database import db

def generate_reference_id():
    """Generate unique reference ID for transactions"""
    return str(uuid.uuid4())[:12].upper()

def generate_transaction_id():
    """Generate unique transaction ID in format: TXN202605140001"""
    from models import Transaction
    
    # Get current date in YYYYMMDD format
    date_str = datetime.utcnow().strftime('%Y%m%d')
    
    # Get count of transactions for today
    today_count = db.session.query(Transaction).filter(
        Transaction.transaction_id.like(f'TXN{date_str}%')
    ).count()
    
    # Generate transaction ID: TXN + YYYYMMDD + 4-digit sequence
    sequence = str(today_count + 1).zfill(4)
    transaction_id = f'TXN{date_str}{sequence}'
    
    return transaction_id
