from django.urls import path
from .views import (
    CreateBookingView, 
    ListBookingView,
    CreateDisabledBlocksView,
    ListDisabledBlockView,
    CreateDisabledDaysView,
    ListDisabledDayView
)

urlpatterns = [
    path('create-booking/', CreateBookingView.as_view()),
    path('bookings/', ListBookingView.as_view()),
    path('create-day/', CreateDisabledDaysView.as_view()),
    path('disabled-days/', ListDisabledDayView.as_view()),
    path('create-blocks/', CreateDisabledBlocksView.as_view()),
    path('disabled-blocks/<slug:day>', ListDisabledBlockView.as_view()),
]
