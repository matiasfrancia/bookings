from django.urls import path
from . import views

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    
    path('create-booking/', views.create_booking, name="create-booking"),
    path('bookings/', views.view_bookings, name="all-bookings"),
    path('bookings/update/<int:pk>', views.update_booking, name="update-booking"),
    path('bookings/delete/', views.delete_booking, name="delete-booking"),

    path('create-day/', views.create_day, name="create-day"),
    path('disabled-days/', views.view_days, name="all-days"),
    path('days/update/<int:pk>', views.update_day, name="update-day"),
    path('days/delete/', views.delete_day, name="delete-day"),

    path('create-block/', views.create_block, name="create-block"),
    path('disabled-blocks/', views.view_blocks, name="all-blocks"),
    path('blocks/update/<int:pk>', views.update_block, name="update-block"),
    path('blocks/delete/', views.delete_block, name="delete-block"),

    path('create-payment/', views.create_payment, name="create-payment"),
    path('payments/', views.view_payments, name="all-payments"),
    path('payments/update/<int:pk>', views.update_payment, name="update-payment"),
    path('payments/<int:pk>/delete/', views.delete_payment, name="delete-payment"),

    path('', views.getRoutes),
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('webpay-plus/create/', views.webpay_plus_create, name="webpay-plus-create"),
    path('webpay-plus/commit/', views.webpay_plus_commit, name="webpay-plus-commit"),
]
