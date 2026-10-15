from django.shortcuts import render
from django.http import JsonResponse
from .models import Student


def student_list(request):
    students = Student.objects.all()

    return JsonResponse([
        {
            "id": student.id,
            "name": student.name,
            "email": student.email,
            "phone": student.phone,
            "department": student.department,
            "year": student.year,
            "skills": student.skills,
        }
        for student in students
    ], safe=False)


def student_api(request):
    students = Student.objects.all()

    data = []

    for student in students:
        data.append({
            "id": student.id,
            "name": student.name,
            "email": student.email,
            "phone": student.phone,
            "department": student.department,
            "year": student.year,
            "skills": student.skills,
        })

    return JsonResponse(data, safe=False)
# Create your views here.
