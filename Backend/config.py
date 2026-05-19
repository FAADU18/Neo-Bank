import os
from datetime import timedelta

class Config:
    """Base configuration"""
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = False
    
    # JWT Configuration for Flask-JWT-Extended
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    import os
    from datetime import timedelta


    def _normalize_database_url(url: str | None) -> str | None:
        if not url:
            return None
        # Vercel and some providers expose DATABASE_URL as 'postgres://'
        # SQLAlchemy requires 'postgresql://' for modern drivers
        if url.startswith('postgres://'):
            return url.replace('postgres://', 'postgresql://', 1)
        return url


    class Config:
        """Base configuration - reads DB from `DATABASE_URL` environment variable."""
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
        SQLALCHEMY_DATABASE_URI = _normalize_database_url(os.getenv('DATABASE_URL'))


    class DevelopmentConfig(Config):
        """Development configuration"""
        DEBUG = True
        SESSION_COOKIE_SECURE = False  # Disable secure cookies for local development
        # Allow override for local development; prefer setting DATABASE_URL in env
        SQLALCHEMY_DATABASE_URI = _normalize_database_url(os.getenv('DATABASE_URL')) or os.getenv(
            'LOCAL_DATABASE_URL', 'sqlite:///banking_app.db'
        )


    class ProductionConfig(Config):
        """Production configuration - requires `DATABASE_URL` to be set."""
        DEBUG = False
        SQLALCHEMY_DATABASE_URI = _normalize_database_url(os.getenv('DATABASE_URL'))


    class TestingConfig(Config):
        """Testing configuration"""
        TESTING = True
        SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'


    # Get config from environment
    config_name = os.getenv('FLASK_ENV', 'development')
    config_dict = {
        'development': DevelopmentConfig,
        'production': ProductionConfig,
        'testing': TestingConfig
    }
