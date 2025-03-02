from mainApp.models import User, Blacklist
from mainApp.env import JwtTokens

import jwt
import datetime
from sys import stderr

from rest_framework.exceptions import AuthenticationFailed

jwt_tokens = JwtTokens()
jwt_secret = jwt_tokens.jwt_secret
jwt_enc_algo = jwt_tokens.jwt_enc_algo


def generate_refresh(_id):
    payload = {
        'id': _id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7),
        'iat': datetime.datetime.utcnow()
    }
    acces_token = jwt.encode(payload, jwt_secret, algorithm=jwt_enc_algo[0])
    return acces_token


def generate_access(_id):
    payload = {
        'id': _id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=15),
        'iat': datetime.datetime.utcnow()
    }
    acces_token = jwt.encode(payload, jwt_secret, algorithm=jwt_enc_algo[0])
    return acces_token


def decode_token(token):
    jwt_tokens.checkJwtToken()
    if token is None:
        raise AuthenticationFailed
    payload = jwt.decode(jwt=token,
                         key=jwt_secret,
                         algorithms=jwt_enc_algo[0])
    usr = User.objects.get(id=payload['id'])
    return usr.id


def validate_access(token):
    try:
        if token is None:
            raise AuthenticationFailed
        if Blacklist.objects.filter(access=token).exists():
            print('Access Token in Blacklist', file=stderr)
            raise AuthenticationFailed
        jwt.decode(jwt=token, key=jwt_secret, algorithms=jwt_enc_algo[0])
        return token
    except Exception:
        return None


def refresh_tokens(token):
    try:
        if Blacklist.objects.filter(refresh=token).exists():
            print('Refresh Token in Blacklist', file=stderr)
            raise AuthenticationFailed
        id = decode_token(token)
        return generate_access(id), generate_refresh(id)
    except Exception:
        return None, None
