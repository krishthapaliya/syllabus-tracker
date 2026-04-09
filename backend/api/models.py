from django.db import models
from django.utils import timezone
import uuid

class Subject(models.Model):
    id = models.CharField(primary_key=True, max_length=100, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=50, blank=True, null=True)
    semester = models.CharField(max_length=100, blank=True, null=True)
    teacher = models.CharField(max_length=200, blank=True, null=True)
    color = models.CharField(max_length=50, default="#6366f1")
    createdAt = models.DateTimeField(default=timezone.now)

class Note(models.Model):
    id = models.CharField(primary_key=True, max_length=100, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=300)
    subjectId = models.CharField(max_length=100)
    chapter = models.CharField(max_length=200, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    link = models.URLField(max_length=500, blank=True, null=True)
    file = models.FileField(upload_to='notes/', blank=True, null=True)
    tags = models.CharField(max_length=300, blank=True, null=True)
    dateUploaded = models.CharField(max_length=100, blank=True, null=True)
    createdAt = models.DateTimeField(default=timezone.now)

class Assignment(models.Model):
    PRIORITY_CHOICES = [('low', 'low'), ('medium', 'medium'), ('high', 'high')]
    id = models.CharField(primary_key=True, max_length=100, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=300)
    subjectId = models.CharField(max_length=100)
    dueDate = models.CharField(max_length=100)
    dueTime = models.CharField(max_length=100, blank=True, null=True)
    totalMarks = models.CharField(max_length=50, blank=True, null=True)
    marks = models.CharField(max_length=50, blank=True, null=True)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    link = models.URLField(max_length=500, blank=True, null=True)
    file = models.FileField(upload_to='assignments/', blank=True, null=True)
    createdAt = models.DateTimeField(default=timezone.now)

class Exam(models.Model):
    EXAM_TYPES = [('midterm', 'midterm'), ('final', 'final'), ('quiz', 'quiz'), ('practical', 'practical'), ('internal', 'internal')]
    id = models.CharField(primary_key=True, max_length=100, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=300)
    subjectId = models.CharField(max_length=100)
    examDate = models.CharField(max_length=100)
    examTime = models.CharField(max_length=100)
    duration = models.CharField(max_length=100, blank=True, null=True)
    venue = models.CharField(max_length=200, blank=True, null=True)
    marks = models.CharField(max_length=50, blank=True, null=True)
    examType = models.CharField(max_length=50, choices=EXAM_TYPES)
    notes = models.TextField(blank=True, null=True)
    createdAt = models.DateTimeField(default=timezone.now)

class SyllabusTopic(models.Model):
    STATUS_CHOICES = [('not-started', 'not-started'), ('in-progress', 'in-progress'), ('completed', 'completed')]
    id = models.CharField(primary_key=True, max_length=100, default=uuid.uuid4, editable=False)
    topic = models.CharField(max_length=300)
    subjectId = models.CharField(max_length=100)
    unit = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES)
    plannedDate = models.CharField(max_length=100, blank=True, null=True)
    completionDate = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    progress = models.IntegerField(default=0)
    createdAt = models.DateTimeField(default=timezone.now)
