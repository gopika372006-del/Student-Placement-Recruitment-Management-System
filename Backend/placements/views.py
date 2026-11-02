from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from .models import Placement, Requirement, Interview, JobApplication
from students.models import Student
from companies.models import Company
from django.contrib.auth.models import User

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

    # GET - View all interviews
    if request.method == "GET":

        interviews = Interview.objects.select_related(
            "student", "company"
        ).all()

        data = []

        for interview in interviews:
            data.append({
                "id": interview.id,
                "student": interview.student.name,
                "student_id": interview.student.id,
                "company": interview.company.company_name,
                "company_id": interview.company.id,
                "job_role": interview.job_role,
                "interview_date": str(interview.interview_date),
                "interview_time": str(interview.interview_time),
                "mode": interview.mode,
                "status": interview.status,
            })

        return JsonResponse(data, safe=False)


    # POST - Create new interview
    elif request.method == "POST":

        try:
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
                status=body.get("status", "Scheduled"),
            )

            return JsonResponse({
                "message": "Interview created successfully",
                "id": interview.id
            }, status=201)

        except Student.DoesNotExist:
            return JsonResponse({"error": "Student not found"}, status=404)

        except Company.DoesNotExist:
            return JsonResponse({"error": "Company not found"}, status=404)

        except (json.JSONDecodeError, TypeError, ValueError):
            return JsonResponse({"error": "Invalid interview data"}, status=400)


    # PUT - Update interview
    elif request.method == "PUT":

        try:
            body = json.loads(request.body)

            interview = Interview.objects.get(id=body.get("id"))

            if "student" in body:
                interview.student = Student.objects.get(id=body["student"])

            if "company" in body:
                interview.company = Company.objects.get(id=body["company"])

            interview.job_role = body.get("job_role", interview.job_role)
            interview.interview_date = body.get(
                "interview_date", interview.interview_date
            )
            interview.interview_time = body.get(
                "interview_time", interview.interview_time
            )
            interview.mode = body.get("mode", interview.mode)
            interview.status = body.get("status", interview.status)

            interview.save()

            return JsonResponse({
                "message": "Interview updated successfully"
            })

        except Interview.DoesNotExist:
            return JsonResponse({"error": "Interview not found"}, status=404)

        except Student.DoesNotExist:
            return JsonResponse({"error": "Student not found"}, status=404)

        except Company.DoesNotExist:
            return JsonResponse({"error": "Company not found"}, status=404)

        except (json.JSONDecodeError, TypeError, ValueError):
            return JsonResponse({"error": "Invalid interview data"}, status=400)


    # DELETE - Delete interview
    elif request.method == "DELETE":

        try:
            body = json.loads(request.body)

            interview = Interview.objects.get(id=body.get("id"))
            interview.delete()

            return JsonResponse({
                "message": "Interview deleted successfully"
            })

        except Interview.DoesNotExist:
            return JsonResponse({
                "error": "Interview not found"
            }, status=404)

        except json.JSONDecodeError:
            return JsonResponse({
                "error": "Invalid JSON data"
            }, status=400)


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


@csrf_exempt
def job_application_api(request):
    if request.method == "GET":
        applications = JobApplication.objects.select_related(
            "student", "requirement", "requirement__company"
        ).all()

        data = []

        for application in applications:
            data.append({
                "id": application.id,
                "student_id": application.student.id,
                "student": application.student.name,
                "requirement_id": application.requirement.id,
                "job_role": application.requirement.job_role,
                "company": application.requirement.company.company_name,
                "applied_date": application.applied_date.isoformat(),
                "status": application.status,
            })

        return JsonResponse(data, safe=False)

    elif request.method == "POST":
        try:
            body = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse(
                {"error": "Invalid JSON data"},
                status=400
            )

        username = body.get("username", "").strip()
        requirement_id = body.get("requirement_id")

        if not username or not requirement_id:
            return JsonResponse(
                {"error": "Username and requirement_id are required"},
                status=400
            )

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return JsonResponse(
                {"error": "User account not found"},
                status=404
            )

        try:
            student = Student.objects.get(email=user.email)
        except Student.DoesNotExist:
            return JsonResponse(
                {
                    "error": (
                        "Student profile not found for this account email. "
                        "Please check the registered email in the Students page."
                    )
                },
                status=400
            )

        try:
            requirement = Requirement.objects.get(id=requirement_id)
        except Requirement.DoesNotExist:
            return JsonResponse(
                {"error": "Job requirement not found"},
                status=404
            )

        if JobApplication.objects.filter(
            student=student,
            requirement=requirement
        ).exists():
            return JsonResponse(
                {"error": "You have already applied for this job"},
                status=409
            )

        application = JobApplication.objects.create(
            student=student,
            requirement=requirement,
        )

        return JsonResponse({
            "message": "Application submitted successfully",
            "id": application.id,
            "status": application.status,
        }, status=201)

    return JsonResponse(
        {"error": "Method not allowed"},
        status=405
    )

# Create your views here.
