import os
from datetime import timedelta

class Config:
    """Base configuration"""
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = False
    
    # JWT Configuration for Flask-JWT-Extended
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    JWT_ALGORITHM = 'HS256'
    JWT_TOKEN_LOCATION = ['headers']
    JWT_HEADER_NAME = 'Authorization'
    JWT_HEADER_TYPE = 'Bearer'
    
    # CORS Configuration - Allow Vercel deployment domains
    CORS_ORIGINS = os.getenv(
        'CORS_ORIGINS',
        'http://localhost:5173,http://localhost:5174,http://localhost:3000'
    ).split(',')
    
    # Session Configuration
    SESSION_COOKIE_SECURE = True  # Enable for production
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    
    # Database - do NOT fall back to SQLite in production.
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL') or 'sqlite:///banking_app.db'


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    SESSION_COOKIE_SECURE = False  # Disable secure cookies for local development
    # Allow override for local development; prefer setting DATABASE_URL in env
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL') or os.getenv(
        'LOCAL_DATABASE_URL', 'sqlite:///banking_app.db'
    )


class ProductionConfig(Config):
    """Production configuration - requires `DATABASE_URL` to be set."""
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL') or 'sqlite:///banking_app.db'


class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
