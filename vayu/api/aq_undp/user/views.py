import csv
import pandas as pd
from datetime import datetime

from django.shortcuts import render
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password, make_password
from django.conf import settings
from django.template.loader import render_to_string

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny

from .models import UserRoles
from .forms import UserCreationForm
from .serializers import (CustomTokenObtainPairSerializer,
                          UserForgotPasswordSerializer, ChangePasswordSerializer, ResetPasswordSerializer,
                          UserProfileSerializer, SignupSerializer)

from mobile_app.models import State, District

from utils.password_generator import get_random_password
from utils.email_utils import send_mail
from utils.password_token import PasswordTokenhandler
from utils.message_utils import get_message
from utils.recaptch import verify_recaptcha

from authentication.authentication import IsCustomerUser

import config

User = get_user_model()
password_token = PasswordTokenhandler()


class CustomTokenObtainPairView(TokenObtainPairView):
    """Simple JWT custom view to pass different response structure"""
    serializer_class = CustomTokenObtainPairSerializer


class ForgotPasswordViewset(viewsets.ModelViewSet):
    authentication_classes = ()
    permission_classes = ()
    serializer_class = UserForgotPasswordSerializer

    def create(self, request, *args, **kwargs):
        """forgot password for user

        Returns:
            # TODO- Response
        """
        serializer = self.serializer_class(data=request.data)
        # checking if such a user exists
        serializer.is_valid(raise_exception=True)
        try:
            email = request.data.get('email')
            try:
                user = User.objects.get(email__iexact=email)
            except User.DoesNotExist:
                return Response(
                    {
                        "success": False,
                        "message": get_message(227)
                    },
                    status.HTTP_200_OK
                )
                
            random_password = get_random_password()

            template = render_to_string('mail/forgot_password.html', {
                'name': user.full_name,
                'password': random_password
            })

            send_mail(
                {
                    'email_from': settings.FROM_EMAIL,
                    'subject': "Forgot Password",
                    'email_to': [email],
                    'message': template
                }
            )
            
            user.set_password(random_password)
            user.save()

            return Response(
                {
                    "code": 200,
                    "success": True,
                    "message": get_message(228)
                },
                status.HTTP_200_OK
            )

        except Exception:
            return Response(
                {
                    "code": 400,
                    "success": False,
                    "message": get_message(400)
                },
                status.HTTP_400_BAD_REQUEST
            )


class ResetPasswordViewset(viewsets.ModelViewSet):

    permission_classes = ()
    serializer_class = ResetPasswordSerializer

    def create(self, request, *args, **kwargs):

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        token = request.data.get("token")
        email = password_token.decode_token(token)
        password = request.data.get("password")

        try:
            user = User.objects.get(email__iexact=email)
            user.set_password(password)
            user.save()
            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "code": 201,
                    "success": True,
                    "message": "Password changed",
                    "access_token": str(refresh.access_token),
                    "refresh": str(refresh)
                },
                status.HTTP_201_CREATED
            )

        except Exception:
            return Response(
                {
                    "code": 400,
                    "success": False,
                    "message": get_message(400)
                },
                status.HTTP_400_BAD_REQUEST
            )


class ChangePasswordViewset(viewsets.ModelViewSet):
    """Change password API for customer"""

    permission_classes = (IsCustomerUser,)
    serializer_class = ChangePasswordSerializer

    def create(self, request, *args, **kwargs):
        """
        This function changes the password of a user and returns a response with success status,
        message, and access and refresh tokens.

        :param request: The HTTP request object containing information about the request made by the
        client
        :return: a Response object with a JSON payload containing a success flag, a message, and a
        result (if applicable), along with an HTTP status code. The content of the response depends on
        the input data and the logic of the function.
        """

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")

        try:
            user = request.user
            if new_password != current_password:
                if check_password(current_password, user.password):
                    user.set_password(new_password)
                    user.save()
                    refresh = RefreshToken.for_user(user)

                    data = {}
                    data["access"] = str(refresh.access_token)
                    data["refresh"] = str(refresh)
                    return Response(
                        {
                            "code": 201,
                            "success": True,
                            "message": get_message(229),
                            "result": data
                        },
                        status.HTTP_201_CREATED
                    )
                else:
                    return Response(
                        {
                            "code": 200,
                            "success": True,
                            "message": get_message(453)
                        },
                        status.HTTP_200_OK
                    )
            else:
                return Response(
                    {
                        "code": 200,
                        "success": False,
                        "message": get_message(454)
                    },
                    status.HTTP_200_OK
                )

        except Exception:
            return Response(
                {
                    "code": 400,
                    "success": False,
                    "message": get_message(400)
                },
                status.HTTP_400_BAD_REQUEST
            )

class UserProfileViewset(viewsets.ModelViewSet):

    permission_classes = (IsCustomerUser,)
    serializer_class = UserProfileSerializer

    def list(self, request, *args, **kwargs):
        user = request.user
        try:
            if user:
                serializer = self.serializer_class(user)
                return Response(
                    {
                        "code": 200,
                        "success": True,
                        "message": get_message(200),
                        "data": serializer.data
                    },
                    status.HTTP_200_OK
                )
            else:
                return Response(
                    {
                        "code": 200,
                        "success": False,
                        "message": get_message(454)
                    },
                    status.HTTP_200_OK
                )

        except Exception:
            return Response(
                {
                    "code": 400,
                    "success": False,
                    "message": get_message(400)
                },
                status.HTTP_400_BAD_REQUEST
            )

class UserSignUpViewset(viewsets.ModelViewSet):

    permission_classes = (AllowAny,)
    serializer_class = SignupSerializer

    def create(self, request, *args, **kwargs):
        g_value = request.data.get('recaptcha')
        if g_value:
            is_verified = verify_recaptcha(g_value)
            if not is_verified:
                return Response(
                        {
                            "code": 400,
                            "message": get_message(458),
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
        else:
            return Response(
                    {
                        "code": 400,
                        "message": get_message(459)
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
        
        email = request.data.get("email")
        confirm_password = request.data.get("confirm_password")
        name = request.data.get("name")
        mobile = request.data.get("mobile")
        gender = request.data.get("gender")
        dob = request.data.get("dob")
        address = request.data.get("address")
        district = request.data.get("district")
        state = request.data.get("state")
        
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        if gender.lower() == 'male':
            gender = 1
        elif gender.lower() == 'female':
            gender = 2
        elif gender.lower() == 'other':
            gender = 3
            
        try:
            state_data = State.objects.get(state_name__iexact=state)
        except State.DoesNotExist:
            return Response(
                {
                    "code": 200,
                    "success": False,
                    "data": "Invalid State."
                },
                status.HTTP_200_OK,
            )
            
        try:
            district_data = District.objects.get(state_id__state_name__iexact=state,
                                                 district_name__iexact=district)
        except District.DoesNotExist:
            return Response(
                {
                    "code": 200,
                    "success": False,
                    "data": "Invalid District."
                },
                status.HTTP_200_OK,
            )
            
        
        try:
            user = User.objects.filter(email__iexact=email)
            if user:
                return Response(
                    {
                        "success": False,
                        "data": "User already registered"
                    },
                    status.HTTP_200_OK,
                )
            else:
                User.objects.create(
                    username = email.lower(),
                    email = email.lower(),
                    password = make_password(confirm_password),
                    full_name = name,
                    role = 3,
                    gender = gender,
                    mobile =mobile,
                    status = False,
                    dob =dob,
                    address =address,
                    district =district_data,
                    state =state_data,
                    created_by = 'self'
                )
                return Response(
                    {
                        "code": 201,
                        "success": True,
                        "data": "SignUp successfully"
                    },
                    status.HTTP_201_CREATED,
                )

        except Exception:
            return Response(
                {
                    "code": 400,
                    "success": False,
                    "message": get_message(400)
                },
                status.HTTP_400_BAD_REQUEST
            )

class UserStatusViewset(viewsets.ModelViewSet):

    permission_classes = (IsCustomerUser,)

    def list(self, request, *args, **kwargs):
        user = request.user
        try:
            if user:
                return Response(
                    {
                        "code": 200,
                        "success": True,
                        "message": get_message(200),
                        "approval": user.status
                    },
                    status.HTTP_200_OK
                )
            else:
                return Response(
                    {
                        "code": 200,
                        "success": False,
                        "message": get_message(454)
                    },
                    status.HTTP_200_OK
                )

        except Exception:
            return Response(
                {
                    "code": 400,
                    "success": False,
                    "message": get_message(400)
                },
                status.HTTP_400_BAD_REQUEST
            )
