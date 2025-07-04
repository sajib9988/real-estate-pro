

from django.urls import path
from .views import PropertyListCreateView, PropertyRetrieveUpdateDestroyView

urlpatterns = [
    path('', PropertyListCreateView.as_view(), name='property-list-create'),
    path('<int:id>/', PropertyRetrieveUpdateDestroyView.as_view(), name='property-detail'),
]
