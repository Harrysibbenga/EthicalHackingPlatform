# Use the official Python image
FROM python:3.12

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Create logs directory
RUN mkdir -p /app/logs

# Set up environment variable (optional)
ENV LOGS_DIR=/app/logs

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port (important for Railway)
EXPOSE 8000

# Start FastAPI with Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
