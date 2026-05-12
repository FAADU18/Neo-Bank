"""Routes initialization"""
from .auth import auth_bp
from .accounts import account_bp
from .transactions import transaction_bp
from .loans import loan_bp
from .admin import admin_bp

__all__ = [
    'auth_bp',
    'account_bp',
    'transaction_bp',
    'loan_bp',
    'admin_bp'
]
