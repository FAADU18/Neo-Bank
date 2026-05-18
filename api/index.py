"""
NeoBankX Flask App - Vercel Serverless Function Entry Point
This file exports the Flask application for Vercel deployment
"""

import sys
import os

# Add parent directory to path so we can import Backend modules
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

# Set Flask environment to production for Vercel
os.environ.setdefault('FLASK_ENV', 'production')

# Import and create the Flask app from Backend
from Backend.app import create_app

# Create the app instance for Vercel
app = create_app(config_name='production')

# Export app for Vercel
__all__ = ['app']
