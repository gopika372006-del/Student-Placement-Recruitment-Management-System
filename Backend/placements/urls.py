from django.urls import path
from . import views

urlpatterns = [
    # Placements API
    path('api/', views.placement_api, name='placement_api'),

    # Job Requirements API
    path('requirements/api/', views.requirement_api, name='requirement_api'),

    # Interviews API
    path('interviews/api/', views.interview_api, name='interview_api'),

    # Reports API
    path('reports/api/', views.reports_api, name='reports_api'),
]