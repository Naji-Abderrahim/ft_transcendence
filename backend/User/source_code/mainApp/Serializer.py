from rest_framework import serializers
from mainApp.models import User


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        exclude = ['twoFAKey']

    def create(self, validated_data):
        user = User.objects.create(**validated_data)
        return user
