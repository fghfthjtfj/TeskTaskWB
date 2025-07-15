from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

app_name = 'api'

router = DefaultRouter()
router.register(r'products', ProductListView)

urlpatterns = [
    path('parse/', RunScriptView.as_view(), name='run-script'),

] + router.urls
