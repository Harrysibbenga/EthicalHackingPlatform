from fastapi import Request
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded
from app.services.alerts import send_discord_alert
from app.services.logging import security_logger

def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    """Handles rate limit exceptions by logging and sending an alert."""
    
    # Send Discord alert (ensure it's not async)
    send_discord_alert(f"🚨 Security Alert 🚨: Rate limit exceeded for {request.client.host} - on url {request.url}")

    # Log the security issue
    security_logger.warning(f"Security Alert: Rate limit exceeded for {request.client.host} - on url {request.url}")

    # Return a proper JSON response
    return JSONResponse(
        status_code=429,
        content={"message": "Too many requests, slow down!"},
    )
