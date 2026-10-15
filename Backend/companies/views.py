from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from .models import Company


@csrf_exempt
def company_api(request):

    # GET - Get all companies
    if request.method == "GET":

        companies = Company.objects.all()

        data = []

        for company in companies:
            data.append({
                "id": company.id,
                "company_name": company.company_name,
                "email": company.email,
                "phone": company.phone,
                "location": company.location,
                "website": company.website,
                "description": company.description,
            })

        return JsonResponse(data, safe=False)


    # POST - Add company
    elif request.method == "POST":

        body = json.loads(request.body)

        company = Company.objects.create(
            company_name=body.get("company_name"),
            email=body.get("email"),
            phone=body.get("phone"),
            location=body.get("location"),
            website=body.get("website"),
            description=body.get("description"),
        )

        return JsonResponse({
            "message": "Company created successfully",
            "id": company.id
        }, status=201)


    # PUT - Update company
    elif request.method == "PUT":

        body = json.loads(request.body)

        company_id = body.get("id")

        try:
            company = Company.objects.get(id=company_id)
        except Company.DoesNotExist:
            return JsonResponse({
                "error": "Company not found"
            }, status=404)

        company.company_name = body.get("company_name")
        company.email = body.get("email")
        company.phone = body.get("phone")
        company.location = body.get("location")
        company.website = body.get("website")
        company.description = body.get("description")

        company.save()

        return JsonResponse({
            "message": "Company updated successfully"
        })


    # DELETE - Delete company
    elif request.method == "DELETE":

        body = json.loads(request.body)

        company_id = body.get("id")

        try:
            company = Company.objects.get(id=company_id)
        except Company.DoesNotExist:
            return JsonResponse({
                "error": "Company not found"
            }, status=404)

        company.delete()

        return JsonResponse({
            "message": "Company deleted successfully"
        })


    return JsonResponse({
        "error": "Method not allowed"
    }, status=405)
# Create your views here.
