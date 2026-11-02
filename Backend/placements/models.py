from django.db import models
from students.models import Student
from companies.models import Company


class Placement(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    job_role = models.CharField(max_length=100)
    placement_date = models.DateField()
    package = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50, default="Selected")

    def __str__(self):
        return f"{self.student.name} - {self.company.company_name}"
# Create your models here.
class Requirement(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    job_role = models.CharField(max_length=100)
    required_skills = models.TextField()
    qualification = models.CharField(max_length=150)
    experience = models.CharField(max_length=50, default="Fresher")
    vacancies = models.PositiveIntegerField()
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    last_date = models.DateField()
    job_description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.company.company_name} - {self.job_role}"


class Interview(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    job_role = models.CharField(max_length=100)
    interview_date = models.DateField()
    interview_time = models.TimeField()
    mode = models.CharField(max_length=50)
    status = models.CharField(max_length=50, default="Scheduled")

    def __str__(self):
        return f"{self.student.name} - {self.company.company_name}"


class JobApplication(models.Model):
    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Selected", "Selected"),
        ("Rejected", "Rejected"),
    ]

    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="job_applications"
    )

    requirement = models.ForeignKey(
        Requirement,
        on_delete=models.CASCADE,
        related_name="applications"
    )

    applied_date = models.DateTimeField(auto_now_add=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Pending"
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["student", "requirement"],
                name="unique_student_job_application"
            )
        ]

    def __str__(self):
        return f"{self.student.name} - {self.requirement.job_role}"
