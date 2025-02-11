import os
from app.services.logging import security_logger
from typing import Dict

import firebase_admin
from firebase_admin import auth, credentials
from fastapi import HTTPException, Security, Header
from fastapi.security import HTTPBearer

from app.services.alerts import send_alert_email, send_discord_alert

from dotenv import load_dotenv
load_dotenv()

# Load Firebase credentials securely
cred_dir = os.getenv("FIREBASE_CREDENTIALS_PATH")
firebase_cred_file = os.path.join(cred_dir, "ethicalhackingplatform-2090f-firebase-adminsdk-fbsvc-b9e56736c8.json")

if not os.path.exists(firebase_cred_file):
    raise RuntimeError(f"Firebase credentials file not found: {firebase_cred_file}")

cred = credentials.Certificate(firebase_cred_file)
firebase_admin.initialize_app(cred)

security = HTTPBearer()

# Secure API keys
API_KEYS = os.getenv("VALID_API_KEYS", "").split(",")

# Remove any accidental whitespace
API_KEYS = [key.strip() for key in API_KEYS if key.strip()]

# JWT Token Verification
def verify_token(authorization: str = Security(security)) -> Dict:
    try:
        token = authorization.credentials  # Extract token from HTTPBearer
        print(token)
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception:
        security_logger.warning("Unauthorized access attempt detected - Invalid JWT token")
        send_alert_email("🚨 Security Alert 🚨: Unauthorized Access", "A failed login attempt was detected.")
        send_discord_alert("🚨 Security Alert 🚨: Unauthorized Access - A failed login attempt was detected.")
        raise HTTPException(status_code=401, detail="Invalid Firebase Token")

# API Key Verification
def verify_api_key(api_key: str = Header(...)):
    
    if not api_key or api_key not in API_KEYS:
        security_logger.warning("Unauthorized access attempt detected - Invalid API Key")
        send_discord_alert("Security Alert 🚨: Unauthorized Access - Invalid API Key")
        raise HTTPException(status_code=403, detail="Invalid API Key")
    
    return True
