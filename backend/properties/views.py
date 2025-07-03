from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Property, PropertyImage
from .serializers import PropertySerializer
from cloudinary.uploader import upload as cloudinary_upload
from django.conf import settings
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from rest_framework.generics import ListCreateAPIView
from rest_framework import generics
import json


class PropertyListCreateView(ListCreateAPIView):
    queryset = Property.objects.all().order_by('-created_at')
    serializer_class = PropertySerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['location', 'bedrooms', 'bathrooms', 'property_type', 'purpose', 'is_published']
    search_fields = ['title', 'description', 'location']


    def post(self, request):
        self.permission_classes = [IsAuthenticated]  # Only POST requires auth
        # Step 1: Parse JSON string from 'propertyData'
        property_data_json = request.POST.get('propertyData')
        try:
            property_data = json.loads(property_data_json)
        except (json.JSONDecodeError, TypeError):
            return Response({'error': 'Invalid JSON in propertyData'}, status=status.HTTP_400_BAD_REQUEST)

        # Step 2: Handle images
        images = request.FILES.getlist('images') if 'images' in request.FILES else []

        # Step 3: Validate with serializer
        serializer = PropertySerializer(data=property_data)
        if serializer.is_valid():
            property_instance = serializer.save(owner=request.user)

            # Step 4: Upload images to Cloudinary
            for img in images:
                result = cloudinary_upload(img)
                PropertyImage.objects.create(
                    property=property_instance,
                    image=result['secure_url']
                )

            return Response(PropertySerializer(property_instance).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
