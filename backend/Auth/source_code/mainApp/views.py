from django.http import HttpResponse, JsonResponse, HttpRequest

from mainApp import jwt_tokens
from mainApp.models import Blacklist
import sys


def error_response(message):
    error = JsonResponse({"error": message}, status=401)
    return error


def refreshToken(request):
    refresh = request.COOKIES.get('jwt_refresh_token', None)
    old_access = request.COOKIES.get('jwt_access_token', "")
    access, refresh = jwt_tokens.refresh_tokens(refresh)
    if access is None and refresh is None:
        resp = JsonResponse({'error': 'Session ended'}, status=401)
        resp.delete_cookie(key='jwt_access_token')
        resp.delete_cookie(key='jwt_refresh_token')
        return resp
    response = JsonResponse({'message': 'access-token Updated'})
    response.set_cookie(key='jwt_access_token',
                        value=access,
                        httponly=True,
                        samesite='Strict')
    response.set_cookie(key='jwt_refresh_token',
                        value=refresh,
                        httponly=True,
                        samesite='Strict')
    blst = Blacklist.objects.create(access=old_access)
    blst.save()
    return response


def checkUser(request: HttpRequest):
    """
    request that contains JWT token access
    if acces is valid then return OK
    if access expired then check refresh token to generate new tokens
    else return 401 to delete them in the callee
    """
    if request.method == 'HEAD':
        old_access = request.COOKIES.get('jwt_access_token', None)
        access = jwt_tokens.validate_access(old_access)

        if access is None:
            print("User has no access !", file=sys.stderr)
            error = JsonResponse({'error': "Session expaired!"}, status=401)
            error.delete_cookie('jwt_access_token')
            error.delete_cookie('jwt_refresh_token')
            return error

        id = jwt_tokens.decode_token(access)
        response = HttpResponse()
        response.headers['X-custom-Header-id'] = id
        return response
    return HttpResponse(status=405)
