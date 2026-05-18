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

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    SESSION_COOKIE_SECURE = False  # Disable secure cookies for local development
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        'sqlite:///banking_app.db'
    )

class ProductionConfig(Config):
    """Production configuration - for Vercel deployment"""
    DEBUG = False
    
    # PostgreSQL for production
    database_url = os.getenv('DATABASE_URL')
    
    # Handle PostgreSQL connection string format
    if database_url:
        # Vercel uses postgres:// but SQLAlchemy 2.0+ requires postgresql://
        if database_url.startswith('postgres://'):
            database_url = database_url.replace('postgres://', 'postgresql://', 1)
        SQLALCHEMY_DATABASE_URI = database_url
    else:
        # Fallback to SQLite if no DATABASE_URL provided
        SQLALCHEMY_DATABASE_URI = 'sqlite:///banking_app.db'
    
class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    JWT_SECRET_KEY = 'test-secret-key'

# Get config from environment
config_name = os.getenv('FLASK_ENV', 'development')
config_dict = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig
}
