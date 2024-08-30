import datetime

from rest_framework import serializers, exceptions
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from django.contrib.auth import get_user_model
from django.contrib.auth.models import update_last_login

from utils.validation_util import validate_email, validate_password
from utils.message_utils import get_message

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Simple JWT custom serializer to pass different response structure"""

    def validate(self, attrs):
        try:
            # for casesensitive email id
            attrs[self.username_field] = str(attrs[self.username_field]).lower()
            data = super().validate(attrs)
            refresh = self.get_token(self.user)

            update_last_login(None, self.user)
            
            if self.user.role == 1:
                role_name = 'Super Admin'
            elif self.user.role == 2:
                role_name = 'Admin'
            elif self.user.role == 3:
                role_name = 'Volunteer'

            data = {
                "code": 200,
                "success": True,
                "user_id": self.user.id,
                "email": self.user.email,
                "username": self.user.username,
                "role": self.user.role,
                "role_name": role_name,
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            }
        except exceptions.AuthenticationFailed as error:
            data = {
                "code": 401,
                "success": False,
                "message": get_message(452)
            }

        return data


class UserForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(min_length=2)

    class Meta:
        fields = ['email']

    def validate(self, data):
        if not validate_email(data["email"]):
            raise serializers.ValidationError("Please input a valid email")

        return data


class ChangePasswordSerializer(serializers.Serializer):
    length_msg = "max lenth is 20"
    current_password = serializers.CharField(max_length=20, error_messages={
                                             "message": length_msg})
    new_password = serializers.CharField(max_length=20, error_messages={
                                         "message": length_msg})
    confirm_password = serializers.CharField(max_length=20, error_messages={
                                             "message": length_msg})

    class Meta:
        fields = ['current_password', 'new_password', 'confirm_password']

    def validate(self, attrs):

        if attrs.get('new_password') != attrs.get('confirm_password'):
            if not validate_password(attrs["new_password"]):
                raise serializers.ValidationError(
                    "Please input a valid password")
            raise serializers.ValidationError("Both fields are not the same")

        return attrs


class ResetPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(max_length = 20, error_messages={"message":"max lenth is 20"})
    confirm_password = serializers.CharField(max_length = 20, error_messages={"message":"max lenth is 20"})

    class Meta:
        fields=['password','confirm_password']

    def validate(self, attrs):
        if  attrs.get('password') != attrs.get('confirm_password'):
            if not validate_password(attrs["password"]):
                raise serializers.ValidationError("Please input a valid password")
            raise serializers.ValidationError("Both fields are not the same")
        return attrs

class UserProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        exclude = ['created_at', 'updated_at', 'password', 'is_superuser', 'last_login', 'is_staff', 'is_active', 'date_joined', 'user_permissions', 'groups']
        
    def to_representation(self, instance):
        representation = super(UserProfileSerializer, self).to_representation(instance)
        if instance.role == 1:
            role_name = 'Super Admin'
        elif instance.role == 2:
            role_name = 'Admin'
        elif instance.role == 3:
            role_name = 'Volunteer'
            
        if instance.gender == 1:
            gender_name = 'Male'
        elif instance.gender == 2:
            gender_name = 'Female'
        elif instance.gender == 3:
            gender_name = 'Other'
        
        representation['role_name'] = role_name
        representation['gender_name'] = gender_name
        representation['state'] = instance.state.state_name
        representation['district'] = instance.district.district_name
        return representation

class SignupSerializer(serializers.Serializer):
    current_password = serializers.CharField(max_length = 20, error_messages={"message":"max lenth is 20"})
    confirm_password = serializers.CharField(max_length = 20, error_messages={"message":"max lenth is 20"})
    email = serializers.CharField(max_length = 255, error_messages={"message":"max lenth is 255"})

    class Meta:
        fields=['email', 'current_password','confirm_password']

    def validate(self, attrs):
        if  attrs.get('current_password') != attrs.get('confirm_password'):
            if not validate_password(attrs["current_password"]):
                raise serializers.ValidationError("Please input a valid password")
            raise serializers.ValidationError("Both fields are not the same")
        if not validate_email(attrs["email"]):
            raise serializers.ValidationError("Please input a valid email")
        return attrs
