from django.urls import path
from .views import PropertyView,   MyPropertiesView

urlpatterns = [
    path('', PropertyView.as_view(), name='property-list-create'),  # GET all / POST new
    path('<int:id>/', PropertyView.as_view(), name='property-detail'),  # GET/PUT/DELETE by ID
    path('my-properties/', MyPropertiesView.as_view(), name='my-properties'),  # 🔐 current user's properties
]
