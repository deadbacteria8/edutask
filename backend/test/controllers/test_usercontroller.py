import pytest
import unittest.mock as mock
from src.util.helpers import EmailValidator

@pytest.mark.parametrize('email, expected', [
    ('palmgrendavid@gmail.com', "david"),
    ('nonexistantemail@gmail.com', None),
    ("duplicateemail@gmail.com", "valid"),
    ("invalidEmail.com", None)
])
def test_validate_email(email, expected):
    mocked_controller = mock.MagicMock()
    mocked_controller.get_user_by_email.return_value = expected
    email_validator = EmailValidator(usercontroller=mocked_controller)
    result = email_validator.validateEmail(email=email)

    assert result == expected