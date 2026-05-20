import os
from datetime import timedelta


def _is_vercel():
    return os.getenv('VERCEL') == '1'


def _normalize_database_url(url):
    """Heroku/Neon sometimes provide postgres://; SQLAlchemy expects postgresql://."""
    if url and url.startswith('postgres://'):
        return url.replace('postgres://', 'postgresql://', 1)
    return url


def _vercel_writable_sqlite_uri():
    """Only /tmp is writable on Vercel serverless (project dir is read-only)."""
    return 'sqlite:////tmp/neobankx.db'


def resolve_database_uri(*, production=False):
    """
    Pick a database URL that can accept writes in the current environment.
    On Vercel, relative SQLite paths (e.g. sqlite:///banking_app.db) are read-only.
    """
    url = _normalize_database_url(os.getenv('DATABASE_URL'))

    if production and _is_vercel():
        if not url:
            return _vercel_writable_sqlite_uri()
        if url.startswith('sqlite:') and '/tmp/' not in url:
            return _vercel_writable_sqlite_uri()

    if url:
        return url

    if production:
        return _vercel_writable_sqlite_uri() if _is_vercel() else 'sqlite:///banking_app.db'

    return os.getenv('LOCAL_DATABASE_URL') or 'sqlite:///banking_app.db'


class Config:
    """Base configuration"""
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = False

    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    JWT_ALGORITHM = 'HS256'
    JWT_TOKEN_LOCATION = ['headers']
    JWT_HEADER_NAME = 'Authorization'
    JWT_HEADER_TYPE = 'Bearer'

    CORS_ORIGINS = os.getenv(
        'CORS_ORIGINS',
        'https://neobankx.vercel.app,http://localhost:5173,http://localhost:5174,http://localhost:3000',
    ).split(',')

    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'

    SQLALCHEMY_DATABASE_URI = resolve_database_uri(production=False)


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    SESSION_COOKIE_SECURE = False
    SQLALCHEMY_DATABASE_URI = resolve_database_uri(production=False)


class ProductionConfig(Config):
    """Production configuration — use PostgreSQL DATABASE_URL on Vercel for persistence."""
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = resolve_database_uri(production=True)


class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
