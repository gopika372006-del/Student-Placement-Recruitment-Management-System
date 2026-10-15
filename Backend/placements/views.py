from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from .models import Placement, Requirement, Interview
from students.models import Student
from companies.models import Company


# =========================
# PLACEMENT API
# =========================

@csrf_exempt
def placement_api(request):

    # GET - Get all placements
    if request.method == "GET":

        placements = Placement.objects.all()

        data = []

        for placement in placements:
            data.append({
                "id": placement.id,
                "student": placement.student.name,
                "company": placement.company.company_name,
                "job_role": placement.job_role,
                "placement_date": str(placement.placement_date),
                "package": str(placement.package),
                "status": placement.status,
            })

        return JsonResponse(data, safe=False)


    # POST - Add placement
    elif request.method == "POST":

        body = json.loads(request.body)

        student = Student.objects.get(id=body.get("student"))
        company = Company.objects.get(id=body.get("company"))

        placement = Placement.objects.create(
            student=student,
            company=company,
            job_role=body.get("job_role"),
            placement_date=body.get("placement_date"),
            package=body.get("package"),
            status=body.get("status"),
        )

        return JsonResponse({
            "message": "Placement created successfully",
            "id": placement.id
        }, status=201)


    # PUT - Update placement
    elif request.method == "PUT":

        body = json.loads(request.body)

        try:
            placement = Placement.objects.get(id=body.get("id"))
        except Placement.DoesNotExist:
            return JsonResponse({
                "error": "Placement not found"
            }, status=404)

        placement.student = Student.objects.get(id=body.get("student"))
        placement.company = Company.objects.get(id=body.get("company"))
        placement.job_role = body.get("job_role")
        placement.placement_date = body.get("placement_date")
        placement.package = body.get("package")
        placement.status = body.get("status")

        placement.save()

        return JsonResponse({
            "message": "Placement updated successfully"
        })


    # DELETE - Delete placement
    elif request.method == "DELETE":

        body = json.loads(request.body)

        try:
            placement = Placement.objects.get(id=body.get("id"))
        except Placement.DoesNotExist:
            return JsonResponse({
                "error": "Placement not found"
            }, status=404)

        placement.delete()

        return JsonResponse({
            "message": "Placement deleted successfully"
        })


    return JsonResponse({
        "error": "Method not allowed"
    }, status=405)


# =========================
# REQUIREMENT API
# =========================

@csrf_exempt
def requirement_api(request):

    # GET
    if request.method == "GET":

        requirements = Requirement.objects.all()

        data = []

        for requirement in requirements:
            data.append({
                "id": requirement.id,
                "job_role": requirement.job_role,
                "company": requirement.company.company_name,
                "required_skills": requirement.required_skills,
                "qualification": requirement.qualification,
                "experience": requirement.experience,
                "vacancies": requirement.vacancies,
                "salary": str(requirement.salary),
                "last_date": str(requirement.last_date),
                "job_description": requirement.job_description,
            })

        return JsonResponse(data, safe=False)


    # POST
    elif request.method == "POST":

        body = json.loads(request.body)

        company = Company.objects.get(id=body.get("company"))

        requirement = Requirement.objects.create(
            company=company,
            job_role=body.get("job_role"),
            required_skills=body.get("required_skills"),
            qualification=body.get("qualification"),
            experience=body.get("experience"),
            vacancies=body.get("vacancies"),
            salary=body.get("salary"),
            last_date=body.get("last_date"),
            job_description=body.get("job_description"),
        )

        return JsonResponse({
            "message": "Requirement created successfully",
            "id": requirement.id
        }, status=201)


    # DELETE
    elif request.method == "DELETE":

        body = json.loads(request.body)

        try:
            requirement = Requirement.objects.get(id=body.get("id"))
        except Requirement.DoesNotExist:
            return JsonResponse({
                "error": "Requirement not found"
            }, status=404)

        requirement.delete()

        return JsonResponse({
            "message": "Requirement deleted successfully"
        })


    return JsonResponse({
        "error": "Method not allowed"
    }, status=405)


# =========================
# INTERVIEW API
# =========================

@csrf_exempt
def interview_api(request):

    # GET
    if request.method == "GET":

        interviews = Interview.objects.all()

        data = []

        for interview in interviews:
            data.append({
                "id": interview.id,
                "student": interview.student.name,
                "company": interview.company.company_name,
                "job_role": interview.job_role,
                "interview_date": str(interview.interview_date),
                "interview_time": str(interview.interview_time),
                "mode": interview.mode,
                "status": interview.status,
            })

        return JsonResponse(data, safe=False)


    # POST
    elif request.method == "POST":

        body = json.loads(request.body)

        student = Student.objects.get(id=body.get("student"))
        company = Company.objects.get(id=body.get("company"))

        interview = Interview.objects.create(
            student=student,
            company=company,
            job_role=body.get("job_role"),
            interview_date=body.get("interview_date"),
            interview_time=body.get("interview_time"),
            mode=body.get("mode"),
            status=body.get("status"),
        )

        return JsonResponse({
            "message": "Interview created successfully",
            "id": interview.id
        }, status=201)


    # DELETE
    elif request.method == "DELETE":

        body = json.loads(request.body)

        try:
            interview = Interview.objects.get(id=body.get("id"))
        except Interview.DoesNotExist:
            return JsonResponse({
                "error": "Interview not found"
            }, status=404)

        interview.delete()

        return JsonResponse({
            "message": "Interview deleted successfully"
        })


    return JsonResponse({
        "error": "Method not allowed"
    }, status=405)


# =========================
# REPORT API
# =========================

def reports_api(request):

    data = {
        "total_students": Student.objects.count(),
        "total_companies": Company.objects.count(),
        "total_placements": Placement.objects.count(),
        "total_requirements": Requirement.objects.count(),
        "total_interviews": Interview.objects.count(),
    }

    return JsonResponse(data)
# Create your views here.
