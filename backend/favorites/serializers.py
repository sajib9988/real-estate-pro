from rest_framework import serializers
from .models import Favorite
from properties.serializers import PropertySerializer

class FavoriteSerializer(serializers.ModelSerializer):
    property = PropertySerializer(read_only=True)

    class Meta:
        model = Favorite
        fields = '__all__'
        read_only_fields = ['user']