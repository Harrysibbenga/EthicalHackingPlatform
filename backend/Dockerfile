# Use official Python image
FROM python:3.12

# Set working directory inside the container
WORKDIR /app

# Copy only requirements.txt first (for efficient Docker caching)
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application files
COPY . .

# Create logs directory
RUN mkdir -p /app/logs

# Set up environment variable
ENV LOGS_DIR=/app/logs

# Set environment variables from Railway
ARG SMTP_PORT
ARG SMTP_SERVER
ARG EMAIL_PASSWORD
ARG EMAIL_RECEIVER
ARG EMAIL_SENDER
ARG FIREBASE_CREDENTIALS_BASE64
ARG DISCORD_WEBHOOK_URL
ARG VALID_API_KEYS
ARG DATABASE_URL

ENV SMTP_PORT=${SMTP_PORT}
ENV SMTP_SERVER=${SMTP_SERVER}
ENV EMAIL_PASSWORD=${EMAIL_PASSWORD}
ENV EMAIL_RECEIVER=${EMAIL_RECEIVER}
ENV EMAIL_SENDER=${EMAIL_SENDER}
ENV FIREBASE_CREDENTIALS_BASE64=${FIREBASE_CREDENTIALS_BASE64}
ENV DISCORD_WEBHOOK_URL=${DISCORD_WEBHOOK_URL}
ENV VALID_API_KEYS=${VALID_API_KEYS}
ENV DATABASE_URL=${DATABASE_URL}

# Expose the port for FastAPI
EXPOSE 8000

# ✅ Debugging: Print environment variables at runtime
CMD echo "✅ Loaded Environment Variables:" \
    && echo "SMTP_PORT: ${SMTP_PORT}" \
    && echo "SMTP_SERVER: ${SMTP_SERVER}" \
    && echo "EMAIL_PASSWORD: ${EMAIL_PASSWORD}" \
    && echo "EMAIL_RECEIVER: ${EMAIL_RECEIVER}" \
    && echo "EMAIL_SENDER: ${EMAIL_SENDER}" \
    && echo "FIREBASE_CREDENTIALS_BASE64: ${FIREBASE_CREDENTIALS_BASE64}" \
    && echo "DISCORD_WEBHOOK_URL: ${DISCORD_WEBHOOK_URL}" \
    && echo "VALID_API_KEYS: ${VALID_API_KEYS}" \
    && echo "DATABASE_URL: ${DATABASE_URL}" \
    && uvicorn main:app --host 0.0.0.0 --port 8000
