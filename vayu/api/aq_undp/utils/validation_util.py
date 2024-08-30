import re
import uuid
import os
from django.core.exceptions import ValidationError

PASSWORD_PATTERN = "((?=.*[0-9])(?=.*[!@#$%&*s]).{6,20})"
EMAIL_REGEX = (
    "^[\\w!#$%&'*+/=?`{|}~^-]+(?:\\.[\\w!#$%&'*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,5}$"
)


def validate_password(password):
    return re.match(PASSWORD_PATTERN, password)


def validate_email(email):
    return re.match(EMAIL_REGEX, email)