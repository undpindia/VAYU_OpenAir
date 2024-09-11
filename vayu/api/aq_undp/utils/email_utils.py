import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders

from django.conf import settings

def send_mail(options):
    try:
        server = smtplib.SMTP(host=settings.SMTP_HOST, port=settings.SMTP_PORT)
        server.ehlo()
        server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        msg = MIMEMultipart()
        msg["From"] = options["email_from"]
        msg["Subject"] = options["subject"]

        if len(options["email_to"]) > 1:
            msg["To"] = ", ".join(options["email_to"])
        else:
            msg["To"] = options["email_to"][0]
        body = options["message"]
        msg.attach(MIMEText(body, 'html'))
        # Sending the email
        mail_result = server.sendmail(options["email_from"], options["email_to"], msg.as_string())
        server.quit()
        return mail_result
    except Exception as e:
        return False