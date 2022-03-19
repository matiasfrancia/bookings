from nturl2path import url2pathname
from django.urls import path
from .views import CreateBookingView, CreateBuyerView, ListBookingView, ListBuyerView

urlpatterns = [
    path('create-booking/', CreateBookingView.as_view()),
    path('create-buyer/', CreateBuyerView.as_view()),
    path('bookings/', ListBookingView.as_view()),
    path('buyers/', ListBuyerView.as_view()),
]
