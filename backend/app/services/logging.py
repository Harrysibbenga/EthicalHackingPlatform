import os
import logging
from dotenv import load_dotenv

load_dotenv()

LOGS_DIR = os.getenv("LOGS_DIR")

# Ensure the logs directory exists
os.makedirs(LOGS_DIR, exist_ok=True)

# Function to create a logger with a separate log file
def get_logger(name, log_file, level=logging.INFO):
    log_path = os.path.join(LOGS_DIR, log_file)
    
    # Create logger
    logger = logging.getLogger(name)
    logger.setLevel(level)

    # Check if logger already has handlers to avoid duplicates
    if not logger.handlers:
        # Create file handler
        file_handler = logging.FileHandler(log_path)
        file_handler.setLevel(level)

        # Define log format
        formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
        file_handler.setFormatter(formatter)

        # Add handler to logger
        logger.addHandler(file_handler)

    return logger

# Define specific loggers
security_logger = get_logger("security", "security.log", logging.WARNING)
app_logger = get_logger("application", "app.log", logging.INFO)