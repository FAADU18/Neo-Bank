"""
NeoBankX Flask App - Vercel Serverless Function Entry Point
"""

import os
import sys

_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
_BACKEND = os.path.join(_ROOT, 'Backend')

# Backend modules use imports like `from config import ...` (not Backend.config)
sys.path.insert(0, _BACKEND)

vendor_site = os.path.join(os.path.dirname(__file__), '.vercel')
if os.path.isdir(vendor_site):
    sys.path.insert(0, vendor_site)

os.environ.setdefault('FLASK_ENV', 'production')

from app import create_app  # noqa: E402

app = create_app(config_name='production')

__all__ = ['app']
