from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from .models import Student


@csrf_exempt
def student_api(request):

    # GET - Get all students
    if request.method == "GET":

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


    # POST - Add student
    elif request.method == "POST":

        body = json.loads(request.body)

        student = Student.objects.create(
            name=body.get("name"),
            email=body.get("email"),
            phone=body.get("phone"),
            department=body.get("department"),
            year=body.get("year"),
            skills=body.get("skills"),
        )

        return JsonResponse({
            "message": "Student created successfully",
            "id": student.id
        }, status=201)


    # PUT - Update student
    elif request.method == "PUT":

        body = json.loads(request.body)

        student_id = body.get("id")

        try:
            student = Student.objects.get(id=student_id)
        except Student.DoesNotExist:
            return JsonResponse({
                "error": "Student not found"
            }, status=404)

        student.name = body.get("name")
        student.email = body.get("email")
        student.phone = body.get("phone")
        student.department = body.get("department")
        student.year = body.get("year")
        student.skills = body.get("skills")

        student.save()

        return JsonResponse({
            "message": "Student updated successfully"
        })


    # DELETE - Delete student
    elif request.method == "DELETE":

        body = json.loads(request.body)

        student_id = body.get("id")

        try:
            student = Student.objects.get(id=student_id)
        except Student.DoesNotExist:
            return JsonResponse({
                "error": "Student not found"
            }, status=404)

        student.delete()

        return JsonResponse({
            "message": "Student deleted successfully"
        })


    return JsonResponse({
        "error": "Method not allowed"
    }, status=405)