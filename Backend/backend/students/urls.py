from django.urls import path
from . import views

urlpatterns = [
    path('', views.student_list, name='student_list'),
    path('api/', views.student_api, name='student_api'),
]