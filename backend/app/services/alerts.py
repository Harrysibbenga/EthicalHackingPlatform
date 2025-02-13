import os
import requests
import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv()

SMTP_SERVER = os.getenv("SMTP_SERVER")
EMAIL_SENDER = os.getenv("EMAIL_SENDER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
EMAIL_RECEIVER = os.getenv("EMAIL_RECEIVER")

DISCORD_WEBHOOK_URL = os.getenv("API_LOGS_DISCORD_WEBHOOK")

try:
    smtp_port_env = os.getenv("SMTP_PORT", "587").strip()  # Remove leading/trailing spaces
    if not smtp_port_env.isdigit():  # Ensure it's a valid number
        raise ValueError("Invalid SMTP_PORT value")
    SMTP_PORT = int(smtp_port_env)
except ValueError:
    print("⚠️ Warning: Invalid SMTP_PORT value. Using default: 587")
    SMTP_PORT = 587  # Default fallback

def send_alert_email(subject, message):
    msg = MIMEText(message)
    msg["Subject"] = subject
    msg["From"] = EMAIL_SENDER
    msg["To"] = EMAIL_RECEIVER

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(EMAIL_SENDER, EMAIL_PASSWORD)
        server.sendmail(EMAIL_SENDER, EMAIL_RECEIVER, msg.as_string())
        server.quit()
        print("🚀 Security alert email sent!")
    except Exception as e:
        print(f"❌ Failed to send email: {e}")

def send_discord_alert(message):
    payload = {"content": f"{message}"}
    response = requests.post(DISCORD_WEBHOOK_URL, json=payload)
    if response.status_code == 204:
        print("🚀 Security alert sent to Discord!")
    else:
        print(f"❌ Failed to send Discord alert: {response.status_code}")
