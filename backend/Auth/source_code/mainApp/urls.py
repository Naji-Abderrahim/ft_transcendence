from django.urls import path
from .views import checkUser, refreshToken
from .register import Register

urlpatterns = [
    path('check_user', checkUser),
    path('refresh', refreshToken),
    path('register', Register.as_view()),
]
