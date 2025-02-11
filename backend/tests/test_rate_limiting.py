from fastapi.testclient import TestClient
from main import app 

client = TestClient(app)

def test_rate_limiting():
    """Test rate limiting by making multiple requests within a short period."""
    for _ in range(6):
        response = client.get("/health")  

    assert response.status_code == 429
    
    assert "too many requests" in response.text.lower()
    assert "slow down!" in response.text.lower()