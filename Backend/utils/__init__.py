"""Utility functions initialization"""
import uuid

def generate_reference_id():
    """Generate unique reference ID for transactions"""
    return str(uuid.uuid4())[:12].upper()
