# accounts/views.py

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.permissions import IsAdminUser, IsAuthenticated

# Models and Serializers
from .models import CustomUser
from .serializers import CustomUserSerializer, MyTokenObtainPairSerializer

# For Custom Token View
from rest_framework_simplejwt.views import TokenObtainPairView


class MyTokenObtainPairView(TokenObtainPairView):
    """
    Custom view for obtaining token pairs.
    It uses MyTokenObtainPairSerializer to include 'role' in the access token.
    """
    serializer_class = MyTokenObtainPairSerializer


class UserListView(APIView):
    """
    API view to handle listing and creating users.
    GET: Returns a list of all users. (Should be restricted to admins in production)
    POST: Creates a new user (User Registration).
    """
    # সাধারণত, সব ইউজার লিস্ট দেখার পারমিশন শুধু অ্যাডমিনদের থাকা উচিত।
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


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def change_user_role(request, user_id):
    """
    API view for a superadmin to change another user's role.
    """
    # শুধুমাত্র superadmin অন্য ইউজারের role পরিবর্তন করতে পারবে।
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

    # নিশ্চিত করুন যে superadmin role পরিবর্তন করা হচ্ছে না এবং role টি বৈধ
    valid_roles = [role[0] for role in CustomUser.ROLE_CHOICES if role[0] != 'superadmin']
    if not new_role or new_role not in valid_roles:
        return Response(
            {'error': f'Invalid role provided. Valid roles are: {", ".join(valid_roles)}'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # superadmin-এর role পরিবর্তন করা যাবে না
    if user_to_change.is_superuser or user_to_change.role == 'superadmin':
         return Response({'error': 'Cannot change the role of a superadmin.'}, status=status.HTTP_403_FORBIDDEN)


    user_to_change.role = new_role
    user_to_change.save(update_fields=['role'])
    
    return Response({'message': f"User's role successfully updated to '{new_role}'."}, status=status.HTTP_200_OK)