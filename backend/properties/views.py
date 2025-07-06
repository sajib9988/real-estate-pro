from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView
from cloudinary.uploader import upload as cloudinary_upload
import json

from .models import Property, PropertyImage
from .serializers import PropertySerializer

class PropertyView(generics.GenericAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['location', 'bedrooms', 'bathrooms', 'property_type', 'purpose', 'is_published']
    search_fields = ['title', 'description', 'location']
    lookup_field = 'id'

    def get_permissions(self):
        if self.request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            return [IsAuthenticated()]
        return [AllowAny()]

    def get(self, request, id=None):
        if id:
            property_instance = self.get_object()
            serializer = self.get_serializer(property_instance)
            return Response(serializer.data)
        else:
            queryset = self.filter_queryset(self.get_queryset())
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)

    def post(self, request):
        property_data_json = request.POST.get('propertyData')
        try:
            property_data = json.loads(property_data_json)
        except (json.JSONDecodeError, TypeError):
            return Response({'error': 'Invalid JSON in propertyData'}, status=status.HTTP_400_BAD_REQUEST)

        images = request.FILES.getlist('images') if 'images' in request.FILES else []

        serializer = self.get_serializer(data=property_data)
        if serializer.is_valid():
            property_instance = serializer.save(owner=request.user)

            for img in images:
                result = cloudinary_upload(img)
                PropertyImage.objects.create(
                    property=property_instance,
                    image=result['secure_url']
                )

            return Response(self.get_serializer(property_instance).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, id=None):
        return self._update(request, id)

    def patch(self, request, id=None):
        return self._update(request, id)

    def _update(self, request, id):
        property_instance = self.get_object()
        serializer = self.get_serializer(property_instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id=None):
        property_instance = self.get_object()
        property_instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)




class MyPropertiesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        properties = Property.objects.filter(owner=request.user)
        serializer = PropertySerializer(properties, many=True)
        return Response(serializer.data)
