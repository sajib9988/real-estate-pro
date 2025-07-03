# accounts/serializers.py

from rest_framework import serializers
from .models import CustomUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomUserSerializer(serializers.ModelSerializer):
    """
    Serializer for the CustomUser model.
    Used for creating (registering) new users and listing them.
    The password is write-only.
    """
    # আমরা role ফিল্ডটি read_only=True করে দিচ্ছি যাতে ইউজার রেজিস্ট্রেশনের সময় এটি সেট করতে না পারে।
    # role শুধুমাত্র অ্যাডমিন বা নির্দিষ্ট লজিক দ্বারা পরিবর্তন করা উচিত।
    role = serializers.CharField(read_only=True)

    class Meta:
        model = CustomUser
        # 'role' 필드টি এখানে যোগ করা হয়েছে যাতে GET রিকোয়েস্টে এটি দেখা যায়।
        fields = ['id', 'email', 'first_name', 'last_name', 'role', 'is_active', 'is_staff', 'date_joined', 'password']
        extra_kwargs = {
            'password': {'write_only': True, 'required': True, 'min_length': 6},
        }

    def create(self, validated_data):
        """
        Create and return a new `CustomUser` instance, given the validated data.
        """
        password = validated_data.pop('password')
        # নতুন ইউজার তৈরির সময় ডিফল্ট role 'buyer' সেট হবে (মডেল থেকে)।
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom token obtain pair serializer to add user's role and email to the token payload.
    """
    @classmethod
    def get_token(cls, user):
        # Call the parent class's method to get the default token
        token = super().get_token(user)

        # Add custom claims to the token's payload
        token['role'] = user.role
        token['email'] = user.email
        token['first_name'] = user.first_name

        return token