from fastapi import APIRouter, Depends
from app.auth import verify_token, verify_api_key
from app.services.logging import app_logger

router = APIRouter()

@router.get("/")
def read_root():
    app_logger.info("Welcome to the Ethical Hacking Learning Platform!")
    return {"message": "Welcome to the Ethical Hacking Learning Platform!"}

@router.get("/health")
def health_check():
    app_logger.info("health_check")
    return {"status": "ok"}

@router.post("/verify-user")
def protected_route(user=Depends(verify_token)):
    app_logger.info("Welcome, you are authenticated!")
    return {"message": "Welcome, you are authenticated!", "user": user}

@router.get("/secure-data", dependencies=[Depends(verify_api_key)])
def secure_data():
    app_logger.info("This is a protected endpoint!")
    return {"message": "This is a protected endpoint!"}