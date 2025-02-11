import httpx

BASE_URL = "http://localhost:8000"

def test_rate_limiting():
    for _ in range(6):  # Exceed the 5/minute limit
        response = httpx.get(f"{BASE_URL}/health")
    assert response.status_code == 429
    assert response.json().get("message") == "Too many requests, slow down!"