from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi.middleware import SlowAPIMiddleware 
from slowapi.errors import RateLimitExceeded
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.routes import router
from app.services.rate_limiting import rate_limit_handler

app = FastAPI()

# Add SlowAPI middleware for rate limiting
app.add_middleware(SlowAPIMiddleware)

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address, default_limits=["5/minute"])
app.state.limiter = limiter  # Ensure the limiter is correctly set in app state

# Define allowed origins
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include router from routes.py
app.include_router(router)

# Add exception handler for rate limiting
app.add_exception_handler(RateLimitExceeded, rate_limit_handler)