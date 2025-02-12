import os
from app.services.logging import security_logger
from typing import Dict
import json
import base64
import firebase_admin
from firebase_admin import auth, credentials
from fastapi import HTTPException, Security, Header
from fastapi.security import HTTPBearer

from app.services.alerts import send_alert_email, send_discord_alert

from dotenv import load_dotenv

load_dotenv()

firebase_creds = None

# ✅ Load from Base64 environment variable
firebase_creds_base64 = os.getenv("FIREBASE_CREDENTIALS_BASE64")
if firebase_creds_base64:
    print("🔥 Loading Firebase credentials from environment variable...")
    try:
        firebase_creds_json = base64.b64decode(firebase_creds_base64).decode("utf-8")
        firebase_creds = json.loads(firebase_creds_json)
    except Exception as e:
        raise ValueError(f"❌ Failed to decode Firebase credentials: {e}")

# ✅ If file exists, load from there (for local development)
elif os.path.exists("/app/firebase.json"):
    print("📂 Loading Firebase credentials from /app/firebase.json...")
    with open("/app/firebase.json", "r") as f:
        firebase_creds = json.load(f)

# ❌ Raise an error if credentials are missing
if not firebase_creds:
    raise ValueError("❌ Firebase credentials not found! Set FIREBASE_CREDENTIALS_BASE64 or provide /app/firebase.json")

# 🔥 Initialize Firebase
try:
    cred = credentials.Certificate(firebase_creds)
    firebase_admin.initialize_app(cred)
    print("✅ Firebase successfully initialized!")
except Exception as e:
    raise ValueError(f"❌ Failed to initialize Firebase: {e}")

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
