import config
import requests

def verify_recaptcha(g_token: str):
    data = {
        'response': g_token,
        'secret': config.CAPTCHA_SECRET_KEY
    }
    resp = requests.post('https://www.google.com/recaptcha/api/siteverify', data=data)
    result_json = resp.json()
    return result_json.get('success') is True
