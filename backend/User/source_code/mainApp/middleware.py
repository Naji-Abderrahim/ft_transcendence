from mainApp.models import User
from django.http import HttpRequest, HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import redirect
from django.shortcuts import reverse
from django.urls import resolve
import requests
import sys


class CheckAuth:
    """ 
    for each request extract the JWT tokens and send them using a HEAD request
    to the AUTH server
    if response 200 then its OK and fetch the data from the Response's Headers
    else Not Authorized and the Error forwarded to the User
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request: HttpRequest):
        view_name = resolve(request.path_info).view_name
        access = request.COOKIES.get('jwt_access_token', None)
        if access is None and (view_name == 'login-view' or view_name == 'login-home'):
            return self.get_response(request)
        cookies = {}
        cookies['jwt_access_token'] = access
        if cookies['jwt_access_token']:
            url = 'http://auth:8001/api/auth/check_user'
            Auth_test = requests.head(url=url, cookies=cookies)
            if Auth_test.status_code != 200:
                if view_name == 'login-view' or view_name == 'login-home':
                    error = HttpResponseRedirect('/')
                else:
                    error = JsonResponse({"error":
                                          Auth_test.content.decode('utf-8')},
                                         status=401)
                error.delete_cookie(key='jwt_access_token')
                error.delete_cookie(key='jwt_refresh_token')
                return error

            request.my_user_id = Auth_test.headers['X-custom-Header-id']
            response = self.get_response(request)
            return response
        else:
            error = HttpResponse("Not authorized", status=401)
            error.delete_cookie(key='jwt_access_token')
            error.delete_cookie(key='jwt_refresh_token')
            return error


class MFAMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request: HttpRequest):
        _id = getattr(request, 'my_user_id', None)
        view_name = resolve(request.path_info).view_name
        if view_name == 'login-view' or view_name == 'login-home':
            return self.get_response(request)
        if _id is None:
            return JsonResponse({"error": "Unothorized"}, status=401)
        userQ = User.objects.filter(id=_id)
        if not userQ.exists():
            return self.get_response(request)
        user = userQ.first()
        if user.is_twofa_validated:
            return self.get_response(request)
        elif view_name != 'validate_2fa' and view_name != 'data-view':
            return JsonResponse({"error": "Forbidden"}, status=403)
        return self.get_response(request)
