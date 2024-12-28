import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

# 寄信給用戶
def send_email(to_email: str, subject: str, plain_text_content: str)->dict:
    try:
        if not to_email and plain_text_content:
            return {
                "code":400,
                "message":f"utils.send_email Error: 須提供：收件人email(to_email), 信件內容(plain_text_content)。\n可選參數：標題(subject)",
                "body":{}
            }
        
        message = Mail(
            from_email=os.getenv("FROM_EMAIL"),
            to_emails=to_email,
            subject=subject if subject else'【二手書交易平台 Book-trade】',
            plain_text_content=plain_text_content
        )
        
        sendgrid_client = SendGridAPIClient(os.getenv('SENDGRID_API_KEY'))
        sendgrid_client.send(message)
        
        return {
            "code":200,
            "message":f"Email sent successfully!",
            "body":{}
        }
    except Exception as e:
        return {
            "code":500,
            "message":f"utils.send_email Error: Failed to send email: {e}",
            "body":{}
        }