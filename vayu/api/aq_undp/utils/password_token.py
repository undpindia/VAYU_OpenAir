import jwt
from datetime import datetime, timedelta

from rest_framework.response import Response
from rest_framework import status, exceptions


class PasswordTokenhandler():
    secret = 'SECRET'

    def encode_token(self, user_id):
        payload = {
            'exp': datetime.utcnow() + timedelta(days=0, minutes=10),
            'iat': datetime.utcnow(),
            'sub': user_id
        }
        return jwt.encode(
            payload,
            self.secret,
            algorithm='HS256'
        )

    def decode_token(self, token):
        try:
            payload = jwt.decode(token, self.secret, algorithms=['HS256'])
            return payload['sub']
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed(
                {
                    "success": True,
                    "message": "Signature has expired"
                },
                status.HTTP_401_UNAUTHORIZED
            )
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed(
                {
                    "success": True,
                    "message": "Invalid token"
                },
                status.HTTP_401_UNAUTHORIZED
            )
