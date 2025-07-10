from django.urls import path
from .views import UserListView, change_user_role, SellerApplicationView

urlpatterns = [
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:user_id>/change-role/', change_user_role, name='change-user-role'),
     path('apply-seller/', SellerApplicationView.as_view(), name='apply-seller'),
]