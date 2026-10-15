from django.urls import path
from . import views

urlpatterns = [
    path('api/', views.student_api, name='student_api'),
]
