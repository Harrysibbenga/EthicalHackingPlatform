from app.auth import verify_api_key
from fastapi import HTTPException
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
from main import app

INVALID_JWT = "invalid_token"
VALID_API_KEY = "your-secret-api-key-1"
INVALID_API_KEY = "wrong-key"

client = TestClient(app) 

# Mock Firebase JWT Verification
@pytest.fixture
def mock_firebase_verify_token():
    with patch("firebase_admin.auth.verify_id_token") as mock_verify:
        mock_verify.return_value = {
            "uid": "test-user-123",
            "email": "testuser@example.com",
            "name": "Test User",
        }
        yield mock_verify

# Test a protected route using the mocked token verification
def test_protected_route(mock_firebase_verify_token):
    token = "fake-jwt-token"

    response = client.post(
        "/verify-user",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    assert response.json() == {
        "message": "Welcome, you are authenticated!",
        "user": {
            "uid": "test-user-123",
            "email": "testuser@example.com",
            "name": "Test User"
        }
    }

# Test an invalid token scenario
def test_invalid_token():
    with patch("firebase_admin.auth.verify_id_token") as mock_verify:
        mock_verify.side_effect = Exception("Invalid Token")

        token = "invalid-jwt-token"

        response = client.post(
            "/verify-user",
            headers={"Authorization": f"Bearer {token}"}
        )

        assert response.status_code == 401
        assert response.json() == {"detail": "Invalid Firebase Token"}

# Test a valid API key
def test_valid_api_key():
    """Test valid API key authentication."""
    try:
        verify_api_key(VALID_API_KEY) 
    except HTTPException:
        pytest.fail("Valid API key should not raise an exception.")

# Test an invalid API key results in 403 error
def test_invalid_api_key():
    """Test invalid API key results in 403 error."""
    with pytest.raises(HTTPException) as exc_info:
        verify_api_key(INVALID_API_KEY)
    assert exc_info.value.status_code == 403
