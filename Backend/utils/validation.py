"""Validation utilities"""

def validate_email(email):
    """Validate email format"""
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone(phone):
    """Validate phone number"""
    import re
    pattern = r'^\d{10,15}$'
    return re.match(pattern, phone.replace(' ', '').replace('-', '')) is not None

def validate_password(password):
    """Validate password strength"""
    errors = []
    if len(password) < 8:
        errors.append("Password must be at least 8 characters long")
    if not any(c.isupper() for c in password):
        errors.append("Password must contain at least one uppercase letter")
    if not any(c.isdigit() for c in password):
        errors.append("Password must contain at least one digit")
    if not any(c in '!@#$%^&*()_+-=' for c in password):
        errors.append("Password must contain at least one special character")
    return len(errors) == 0, errors

def validate_amount(amount):
    """Validate transaction amount"""
    try:
        amt = float(amount)
        if amt <= 0:
            return False, "Amount must be greater than 0"
        return True, None
    except (TypeError, ValueError):
        return False, "Invalid amount format"
