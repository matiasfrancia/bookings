from django.urls import path
from . import views

urlpatterns = [
    # path('create-booking/', views.CreateBookingView.as_view()),
    # path('bookings/', views.ListBookingView.as_view()),

    # path('create-day/', views.CreateDisabledDaysView.as_view()),
    # path('disabled-days/', views.ListDisabledDayView.as_view()),
    # path('create-blocks/', views.CreateDisabledBlocksView.as_view()),
    # path('disabled-blocks/<slug:day>', views.ListDisabledBlockView.as_view()),
    
    path('create-booking/', views.create_booking, name="create-booking"),
    path('bookings/', views.view_bookings, name="all-bookings"),
    path('bookings/update/<int:pk>', views.update_booking, name="update-booking"),
    path('bookings/<int:pk>/delete/', views.delete_booking, name="delete-booking"),

    path('create-day/', views.create_day, name="create-day"),
    path('disabled-days/', views.view_days, name="all-days"),
    path('days/update/<int:pk>', views.update_day, name="update-day"),
    path('days/<int:pk>/delete/', views.delete_day, name="delete-day"),

    path('create-block/', views.create_block, name="create-block"),
    path('disabled-blocks/', views.view_blocks, name="all-blocks"),
    path('blocks/update/<int:pk>', views.update_block, name="update-block"),
    path('blocks/<int:pk>/delete/', views.delete_block, name="delete-block"),

    path('create-payment/', views.create_payment, name="create-payment"),
    path('disabled-payments/', views.view_payments, name="all-payments"),
    path('payments/update/<int:pk>', views.update_payment, name="update-payment"),
    path('payments/<int:pk>/delete/', views.delete_payment, name="delete-payment"),

    path('overview/', views.ApiOverview, name="overview"),

]
