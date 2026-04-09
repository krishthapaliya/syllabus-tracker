from rest_framework import viewsets
from .models import Subject, Note, Assignment, Exam, SyllabusTopic
from .serializers import (
    SubjectSerializer, NoteSerializer, AssignmentSerializer, ExamSerializer, SyllabusTopicSerializer
)

class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all().order_by('-createdAt')
    serializer_class = SubjectSerializer

class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all().order_by('-createdAt')
    serializer_class = NoteSerializer

class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all().order_by('-dueDate')
    serializer_class = AssignmentSerializer

class ExamViewSet(viewsets.ModelViewSet):
    queryset = Exam.objects.all().order_by('examDate')
    serializer_class = ExamSerializer

class SyllabusTopicViewSet(viewsets.ModelViewSet):
    queryset = SyllabusTopic.objects.all().order_by('-createdAt')
    serializer_class = SyllabusTopicSerializer
