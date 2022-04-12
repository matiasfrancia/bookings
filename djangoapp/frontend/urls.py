from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('about-us/', index),
    path('bookings/', index),
    path('contact/', index),
    path('login/', index),
]