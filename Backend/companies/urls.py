from django.urls import path
from . import views

urlpatterns = [
    path('api/', views.company_api, name='company_api'),
]
