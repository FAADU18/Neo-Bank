import os
from datetime import timedelta


def _is_vercel():
    return os.getenv('VERCEL') == '1'


def _normalize_database_url(url):
    """Heroku/Neon/Supabase sometimes provide postgres://; SQLAlchemy expects postgresql://."""
    if not url:
        return None
    url = url.strip()
    if not url:
        return None
    if url.startswith('postgres://'):
        url = url.replace('postgres://', 'postgresql://', 1)
    if url.startswith('postgresql://') and '+psycopg2' not in url:
        url = url.replace('postgresql://', 'postgresql+psycopg2://', 1)
    return url


def _vercel_writable_sqlite_uri():
    """Only /tmp is writable on Vercel serverless (project dir is read-only)."""
    return 'sqlite:////tmp/neobankx.db'


def _postgres_connect_args(url):
    if 'supabase' in url or 'neon' in url or 'postgresql' in url:
        return {'sslmode': 'require'}
    return {}


def _can_connect(url):
    try:
        from sqlalchemy import create_engine, text

        engine = create_engine(
            url,
            connect_args=_postgres_connect_args(url),
            pool_pre_ping=True,
        )
        with engine.connect() as conn:
            conn.execute(text('SELECT 1'))
        return True
    except Exception:
        return False


def resolve_database_uri(*, production=False):
    """
    Pick a database URL that can accept writes in the current environment.
    On Vercel, relative SQLite paths (e.g. sqlite:///banking_app.db) are read-only.
  """
    raw = (os.getenv('DATABASE_URL') or '').strip()
    url = _normalize_database_url(raw)

    if production and _is_vercel():
        if not url:
            return _vercel_writable_sqlite_uri()
        if url.startswith('sqlite:') and '/tmp/' not in url:
            return _vercel_writable_sqlite_uri()
        if url.startswith('postgresql') and not _can_connect(url):
            return _vercel_writable_sqlite_uri()

    if url:
        return url

    if production:
        return _vercel_writable_sqlite_uri() if _is_vercel() else 'sqlite:///banking_app.db'

    return os.getenv('LOCAL_DATABASE_URL') or 'sqlite:///banking_app.db'


def engine_options_for_uri(url):
    if url and url.startswith('postgresql'):
        return {
            'pool_pre_ping': True,
            'connect_args': _postgres_connect_args(url),
        }
    return {'pool_pre_ping': True}


class Config:
    """Base configuration"""
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = False
    SQLALCHEMY_ENGINE_OPTIONS = {'pool_pre_ping': True}

    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    JWT_ALGORITHM = 'HS256'
    JWT_TOKEN_LOCATION = ['headers']
    JWT_HEADER_NAME = 'Authorization'
    JWT_HEADER_TYPE = 'Bearer'

    CORS_ORIGINS = os.getenv(
        'CORS_ORIGINS',
        'https://neobankx.vercel.app,https://neo-bank-puce.vercel.app,http://localhost:5173,http://localhost:5174,http://localhost:3000',
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
