from django.conf import settings
from django.db import models

class Property(models.Model):
    SALE = 'For Sale'
    RENT = 'For Rent'
    PURPOSE_CHOICES = [
        (SALE, 'For Sale'),
        (RENT, 'For Rent'),
    ]


    PENDING = 'Pending'
    APPROVED = 'Approved'
    REJECTED = 'Rejected'
    STATUS_CHOICES = [
        (PENDING, 'Pending'),
        (APPROVED, 'Approved'),
        (REJECTED, 'Rejected'),
    ]
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='properties'
    )
    title = models.CharField(max_length=223, unique=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    location = models.CharField(max_length=255)
    bedrooms = models.PositiveIntegerField()
    bathrooms = models.PositiveIntegerField()
    space = models.PositiveIntegerField(help_text="Square feet")
    property_type = models.CharField(max_length=50, blank=True)
    purpose = models.CharField(max_length=10, choices=PURPOSE_CHOICES, default=SALE)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=PENDING)
    is_published = models.BooleanField(default=False)  
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class PropertyImage(models.Model):
    property = models.ForeignKey(Property, related_name='images', on_delete=models.CASCADE)
    image = models.URLField()  

    def __str__(self):
        return f"Image for {self.property.title}"