from django.urls import path
from mainApp import views, mfa

urlpatterns = [
    path('data', views.get_data, name='data-view'),
    path('login', views.Login.as_view(), name='login-view'),
    path('logout', views.Logout.as_view(), name='logout-view'),
    path('enable2FA', mfa.EnableTwoFa.as_view()),
    path('disable2FA', mfa.disable_2FA),
    path('verify', mfa.ValidateTFA.as_view(), name='validate_2fa'),

    # path('test', views.test),
]
