import pyotp
import qrcode
from django.http import JsonResponse
from io import BytesIO
import base64
import json


from mainApp.models import User
from rest_framework.decorators import api_view
from rest_framework.views import APIView


class ValidateTFA(APIView):

    def dispatch(self, request, *args, **kwargs):
        userQ = User.objects.filter(id=getattr(request, 'my_user_id', None))
        if userQ.exists():
            self.user = userQ.first()
        return super().dispatch(request, *args, **kwargs)

    def post(self, request):
        if not self.user.is_2fa_ebnabled():
            return JsonResponse({"error": "2FA is Disabled"}, status=403)
        try:
            check_otp = pyotp.TOTP(self.user.twoFAKey)
            data = json.loads(request.body.decode('utf-8'))
            code = int(data.get('user_input', None))
            if code and check_otp.verify(code):
                self.user.is_twofa_validated = True
                self.user.save()
                return JsonResponse({"message": "succes"})
            return JsonResponse({"error": "Incorrect Code"}, status=403)
        except Exception:
            return JsonResponse({'error': 'Bad User Input'}, status=400)


# 1-> check if the user is loged in V
# 2-> initiate the pytop V
# 3-> check for the one time password V
# 3-> change the twoFA field to True V
# 4-> store the key in the same field with the user V

class EnableTwoFa(APIView):

    def __init__(self):
        self.user = None

    def dispatch(self, request, *args, **kwargs):
        userQ = User.objects.filter(id=getattr(request, 'my_user_id', None))
        if userQ.exists():
            self.user = userQ.first()
        return super().dispatch(request, *args, **kwargs)

    def is_2fs_allowed(self, user_input):
        one_time_code = pyotp.TOTP(self.user.twoFAKey)
        if one_time_code.verify(user_input):
            self.user.enable_2FA()
            self.user.save()
            return True
        return False

    def get(self, request):
        if self.user.twoFA:
            return JsonResponse({"error": "2FA already Enabled"}, status=403)
        tmp_key = pyotp.random_base32()
        self.user.twoFAKey = tmp_key
        self.user.save()
        _pytop = pyotp.TOTP(tmp_key).provisioning_uri(
            name=self.user.login, issuer_name='Ai')
        import sys
        print(_pytop, file=sys.stderr)
        img = qrcode.make(_pytop)
        img_io = BytesIO()

        img.save(img_io, format='PNG')
        img_io.seek(0)
        image_data = base64.b64encode(img_io.getvalue()).decode('utf-8')
        image_url = f"data:image/png;base64,{image_data}"
        return JsonResponse({'image': image_url, 'url': _pytop})

    def post(self, request):
        try:
            data = json.loads(request.body.decode('utf-8'))
            user_input = int(data.get('user_input', None))
            if not user_input:
                return JsonResponse({'error': 'Data Not Valid'}, status=403)
            if self.is_2fs_allowed(user_input):
                return JsonResponse({'message': '2FA enabled succefully'})
            return JsonResponse({'error': 'cannot enable 2FA'}, status=403)
        except Exception:
            return JsonResponse({'error': 'Bad user Input'}, status=400)


@api_view(['GET'])
def disable_2FA(request):
    _id = getattr(request, 'my_user_id', None)
    userQ = User.objects.filter(id=_id)
    if userQ.exists():
        user = userQ.first()
        if not user.is_2fa_ebnabled():
            return JsonResponse({'error': '2FA already Disabled'}, status=403)
        user.twoFA = False
        user.is_twofa_validated = True
        user.twoFAKey = ''
        user.save()
    return JsonResponse({'message': '2FA disabled'})
