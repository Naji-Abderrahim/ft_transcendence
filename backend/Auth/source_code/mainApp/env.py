from os import environ
from sys import stderr


class InvalidApiToken(Exception):
    pass


class InvalidJwtToken(Exception):
    pass


class IntaTokens:
    def __init__(self):
        self.client_id = environ.get('CLIENT_ID', None)
        self.client_secret = environ.get('CLIENT_SECRET', None)
        self.uri = environ.get('URI', None)
        self.redirect_to_intra_uri = environ.get(
            'REDIRECT_TO_INTRA', None)  # local -> INTRA
        self.redirect_from_intra_uri = environ.get(
            'REDIRECT_FROM_INTRA', None)  # INTRA -> local
        self.grant_type = environ.get('GRANT_TYPE', None)

    def checkIntraToken(self):
        if not self.client_id or not self.client_secret:
            print("Error: client_id/client_secret", file=stderr)
            raise InvalidApiToken
        if not self.uri or not self.redirect_from_intra_uri:
            print("Error: URI/FROM_INTRA", file=stderr)
            raise InvalidApiToken
        if not self.redirect_to_intra_uri or not self.grant_type:
            print("Error: TO_INTRA/GRANT", file=stderr)
            raise InvalidApiToken


class JwtTokens:
    def __init__(self):
        self.jwt_enc_algo = [environ.get('JWT_ENC_ALGO', None)]
        self.jwt_secret = environ.get('JWT_KEY', None)

    def checkJwtToken(self):
        if not self.jwt_secret or not self.jwt_enc_algo:
            raise InvalidJwtToken
