import json
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    """Отправка заявки с сайта на почту i@auljanova.ru через Яндекс SMTP"""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    body = json.loads(event.get('body') or '{}')
    name = body.get('name', '').strip()
    phone = body.get('phone', '').strip()
    message = body.get('message', '').strip()

    if not phone:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': {'error': 'Телефон обязателен'}
        }

    smtp_user = 'missis.alio@yandex.ru'
    smtp_password = os.environ['SMTP_PASSWORD']
    to_email = 'i@auljanova.ru'

    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'Новая заявка с сайта — {name or "Без имени"}'
    msg['From'] = smtp_user
    msg['To'] = to_email

    text = f"""Новая заявка с сайта ж/б лестниц

Имя: {name or 'не указано'}
Телефон: {phone}
Сообщение: {message or 'не указано'}
"""

    html = f"""
<div style="font-family: Arial, sans-serif; max-width: 500px; padding: 24px; background: #f9f9f9; border-radius: 8px;">
  <h2 style="color: #1a1a1a; margin-top: 0;">Новая заявка с сайта</h2>
  <table style="width: 100%; border-collapse: collapse;">
    <tr><td style="padding: 8px 0; color: #666; width: 120px;">Имя</td><td style="padding: 8px 0; font-weight: bold;">{name or 'не указано'}</td></tr>
    <tr><td style="padding: 8px 0; color: #666;">Телефон</td><td style="padding: 8px 0; font-weight: bold;"><a href="tel:{phone}" style="color: #1a1a1a;">{phone}</a></td></tr>
    <tr><td style="padding: 8px 0; color: #666; vertical-align: top;">Сообщение</td><td style="padding: 8px 0;">{message or 'не указано'}</td></tr>
  </table>
</div>
"""

    msg.attach(MIMEText(text, 'plain', 'utf-8'))
    msg.attach(MIMEText(html, 'html', 'utf-8'))

    with smtplib.SMTP_SSL('smtp.yandex.ru', 465) as server:
        server.login(smtp_user, smtp_password)
        server.sendmail(smtp_user, to_email, msg.as_string())

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': {'ok': True}
    }