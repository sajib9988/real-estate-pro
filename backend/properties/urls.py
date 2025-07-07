from django.urls import path
from .views import PropertyView, MyPropertiesView, SellerPropertyApprove

urlpatterns = [
    path('', PropertyView.as_view(), name='property-list-create'),  # GET all / POST new
    path('<int:id>/', PropertyView.as_view(), name='property-detail'),  # GET/PUT/DELETE by ID
    path('my-properties/', MyPropertiesView.as_view(), name='my-properties'), 
    path('properties-permission/<int:id>/', SellerPropertyApprove.as_view(), name= 'SellerPropertyApprove'),

]
