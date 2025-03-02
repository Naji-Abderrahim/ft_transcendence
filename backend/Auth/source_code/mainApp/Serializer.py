from rest_framework import serializers
from mainApp.models import User, Blacklist


# class ProfileSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Profile
#         fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    # profile = ProfileSerializer()

    class Meta:
        model = User
        # exclude = ['is_twofa_validated', 'twoFAKey', 'twoFA']
        exclude = ['twoFAKey']

    def create(self, validated_data):
        user = User.objects.create(**validated_data)
        return user


# class BlacklistSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Blacklist
#
#     def create(self, validated_data):
#         blacklist = Blacklist.objects.create(**validated_data)
#         return blacklist
