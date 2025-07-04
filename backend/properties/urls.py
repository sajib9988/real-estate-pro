from django.urls import path
from .views import PropertyView  # ✅ ঠিক ক্লাস ইমপোর্ট করো

urlpatterns = [
    path('', PropertyView.as_view(), name='property-list-create'),
    path('<int:id>/', PropertyView.as_view(), name='property-detail'),
]
