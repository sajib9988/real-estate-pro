from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import CustomUser
from .serializers import (
    SellerApplicationSerializer,
    CustomUserSerializer,
    MyTokenObtainPairSerializer
)
from .permission import IsSuperAdmin


# ------------------------------------------------------------------
# Custom JWT Token View - includes user's role in the response
# ------------------------------------------------------------------

class MyTokenObtainPairView(TokenObtainPairView):
    """
    Custom view for obtaining token pairs.
    Uses a custom serializer to include 'role' in the access token.
    """
    serializer_class = MyTokenObtainPairSerializer


# ------------------------------------------------------------------
# User List and Registration View
# ------------------------------------------------------------------

class UserListView(APIView):
    """
    GET: Returns a list of all users.
    POST: Creates a new user (registration).
    NOTE: In production, listing users should be restricted to admins.
    """
    # Uncomment this in production
    # permission_classes = [IsAdminUser]

    def get(self, request):
        users = CustomUser.objects.all()
        serializer = CustomUserSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ------------------------------------------------------------------
# Change Role API for Superadmin Only
# ------------------------------------------------------------------

@api_view(['PATCH'])
@permission_classes([IsSuperAdmin])
def change_user_role(request, user_id):
    """
    Allows a superadmin to change the role of another user.
    Superadmin's own role cannot be changed.
    """
    if not request.user.role == 'superadmin':
        return Response(
            {'error': 'Permission denied. Only superadmin can change user roles.'},
            status=status.HTTP_403_FORBIDDEN
        )

    try:
        user_to_change = CustomUser.objects.get(id=user_id)
    except CustomUser.DoesNotExist:
        return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

    new_role = request.data.get('role')

    # Valid roles excluding 'superadmin'
    valid_roles = [role[0] for role in CustomUser.ROLE_CHOICES if role[0] != 'superadmin']

    if not new_role or new_role not in valid_roles:
        return Response(
            {'error': f'Invalid role provided. Valid roles are: {", ".join(valid_roles)}'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if user_to_change.is_superuser or user_to_change.role == 'superadmin':
        return Response(
            {'error': 'Cannot change the role of a superadmin.'},
            status=status.HTTP_403_FORBIDDEN
        )

    user_to_change.role = new_role
    user_to_change.save(update_fields=['role'])

    return Response(
        {'message': f"User's role successfully updated to '{new_role}'."},
        status=status.HTTP_200_OK
    )


# ------------------------------------------------------------------
# Seller Application View (for logged-in users only)
# ------------------------------------------------------------------

class SellerApplicationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if hasattr(request.user, 'seller_application'):
            return Response({'error': 'You have already applied to be a seller.'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = SellerApplicationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        # 👇 Return detailed error message for debugging
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
