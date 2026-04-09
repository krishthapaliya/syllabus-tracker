from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SubjectViewSet, NoteViewSet, AssignmentViewSet, ExamViewSet, SyllabusTopicViewSet

router = DefaultRouter()
router.register(r'subjects', SubjectViewSet)
router.register(r'notes', NoteViewSet)
router.register(r'assignments', AssignmentViewSet)
router.register(r'exams', ExamViewSet)
router.register(r'syllabus', SyllabusTopicViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
