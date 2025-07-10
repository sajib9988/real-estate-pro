# accounts/serializers.py

from rest_framework import serializers
from .models import CustomUser, SellerApplication  # ✅ Import SellerApplication
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomUserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(read_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'first_name', 'last_name', 'role', 'is_active', 'is_staff', 'date_joined', 'password']
        extra_kwargs = {
            'password': {'write_only': True, 'required': True, 'min_length': 6},
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['email'] = user.email
        token['first_name'] = user.first_name
        return token


class SellerApplicationSerializer(serializers.ModelSerializer):  # ✅ এবার ঠিক জায়গায়
    class Meta:
        model = SellerApplication
        fields = '__all__'
