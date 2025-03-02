from mainApp.models import User, Blacklist
from mainApp.Serializer import UserSerializer

from django.http import HttpResponseRedirect
from rest_framework.exceptions import ValidationError, AuthenticationFailed
from rest_framework.views import APIView
import jwt
import requests
from sys import stderr

from django.shortcuts import redirect

from rest_framework.decorators import api_view
from rest_framework.response import Response
from os import environ

api_url = environ.get('REDIRECT_TO_INTRA', None)


ROOT_PAGE = '/'
HOME_PAGE = '/home'
INETRNAL_SERVER_PAGE = '/501-server-error'


def is_logged(cookies):
    return (cookies.get('jwt_access_token', None) is not None)


def home(request):
    if is_logged(request.COOKIES):
        return HttpResponseRedirect(HOME_PAGE)
    else:
        if not api_url:
            return HttpResponseRedirect(INETRNAL_SERVER_PAGE)
        return redirect(api_url)


@api_view(['GET'])
def get_data(request):
    user_id = getattr(request, 'my_user_id', None)
    if not user_id:
        return Response({"error": "User does Not exist!"}, status=403)
    usr = User.objects.get(id=user_id)
    serializer = UserSerializer(usr)
    return Response(serializer.data)


class Login(APIView):

    def __init__(self):
        self.access = None
        self.refresh = None
        self.http_method_not_allowed = ['get']
        self.url = "http://auth:8001/api/auth/register"

    def register_user(self, path_value, host):
        hdrs = {'X-Custom-Code': path_value.get('code', None)}
        user_request = requests.head(self.url, headers=hdrs)
        if user_request.status_code != 200:
            raise ValidationError("Unable to create new user")
        self.access = user_request.headers.get('X-access-token', None)
        self.refresh = user_request.headers.get('X-refresh-token', None)
        if self.access is None:
            raise AuthenticationFailed("Not Authorized")

    def get(self, request):
        if is_logged(request.COOKIES):
            return HttpResponseRedirect(HOME_PAGE)
        try:
            self.register_user(request.GET, request.get_host())
            resp = HttpResponseRedirect(HOME_PAGE)
            resp.set_cookie(key='jwt_access_token',
                            value=self.access,
                            httponly=True,
                            samesite="Strict")
            resp.set_cookie(key='jwt_refresh_token',
                            value=self.refresh,
                            httponly=True,
                            samesite="Strict")
            return resp
        except AuthenticationFailed as err:
            print("Error: ", err.get_full_details, file=stderr)
            return HttpResponseRedirect(ROOT_PAGE)
        except Exception as err:
            print("Error: ", err, file=stderr)
            err_response = HttpResponseRedirect(INETRNAL_SERVER_PAGE)
            return err_response


class Logout(APIView):

    def updateBlacklist(self, tokens):
        access = tokens.get('jwt_access_token', None)
        refresh = tokens.get('jwt_refresh_token', None)
        if not access and not refresh:
            return
        blist = Blacklist.objects.create(access=access, refresh=refresh)
        blist.save()

    def get(self, request):
        _id = getattr(request, 'my_user_id', None)
        if not _id:
            return Response({"error": "User Not exist"}, status=403)
        userQ = User.objects.filter(id=_id)
        if userQ.exists() and userQ.first().twoFA is True:
            user = userQ.first()
            user.is_twofa_validated = False
            user.save()
        print("Loggin Out", file=stderr)
        self.updateBlacklist(request.COOKIES)
        data = {"message ": 'Logout'}
        logout_response = Response(data=data, status=200)
        logout_response.delete_cookie('jwt_access_token')
        logout_response.delete_cookie('jwt_refresh_token')
        return logout_response
