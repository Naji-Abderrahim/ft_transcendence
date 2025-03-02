from mainApp.models import User
from mainApp.Serializer import UserSerializer
from mainApp.jwt_tokens import generate_access, generate_refresh
from mainApp.env import IntaTokens, InvalidApiToken

from django.http import HttpResponse
from django.views import View

import requests
from sys import stderr


# rest API imports
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.exceptions import PermissionDenied


class Register(View):

    def __init__(self):
        self.http_method_names = ['head']

    def getDataFromAPI(self, init_data: dict):
        final_data: dict = {}
        final_data['id'] = init_data.get('id', None)
        final_data['first_name'] = init_data.get('first_name', None)
        final_data['last_name'] = init_data.get('last_name', None)
        final_data['image'] = init_data.get('image', None).get('link', None)
        final_data['email'] = init_data.get('email', None)
        final_data['login'] = init_data.get('login', None)
        return final_data

    def get_data_from_42(self, code):
        tokens = IntaTokens()
        tokens.checkIntraToken()
        payload = {
            'grant_type': tokens.grant_type,
            'client_id': tokens.client_id,
            'client_secret': tokens.client_secret,
            'code': code,
            'redirect_uri': tokens.redirect_from_intra_uri
        }
        resp = requests.post(tokens.uri, data=payload)

        if resp.status_code == 200:
            hdrs = {'Authorization': 'Bearer ' +
                    resp.json().get('access_token', None)}
            resp1 = requests.get(
                url='https://api.intra.42.fr/v2/me', headers=hdrs)
            if resp1.status_code == 200:
                data = self.getDataFromAPI(resp1.json())
                return data
            raise PermissionDenied("No permission")

    def update_user_stat(self, user: User):
        if user.twoFA:
            user.is_twofa_validated = False
            user.save()

    def create_user(self, code):
        data = self.get_data_from_42(code)
        if data is None:
            print("Error: no DATA from 42", file=stderr)
            return None, None
        serializer = UserSerializer(data=data)
        if data.get('id', None):
            _id = User.objects.filter(id=data.get('id', None))
            if _id.exists():
                self.update_user_stat(_id.first())
                print("Info: USER exists", file=stderr)
                access = generate_access(_id.first().id)
                refresh = generate_refresh(_id.first().id)
                return access, refresh
        if serializer.is_valid(raise_exception=True):
            print("Info: Create new USER", file=stderr)
            access = generate_access(serializer.validated_data['id'])
            refresh = generate_refresh(serializer.validated_data['id'])
            serializer.save()
            return access, refresh
        raise AuthenticationFailed

    def head(self, request):
        code = request.headers.get('X-Custom-Code', None)
        if code is None:
            return HttpResponse(status=401)
        try:
            access, refresh = self.create_user(code)
            if access is None:
                return HttpResponse(status=401)
            response = HttpResponse()
            response.headers['X-access-token'] = access
            response.headers['X-refresh-token'] = refresh
            return response
        except Exception:
            print("Error: User/Intra Token Invalid", file=stderr)
            return HttpResponse(status=401)
