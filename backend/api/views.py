import asyncio
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_200_OK, HTTP_201_CREATED, HTTP_500_INTERNAL_SERVER_ERROR
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import *
from .models import *
import django_filters
from .parser import run_parse


# Реализация фильтрации
class ProductFilter(django_filters.FilterSet):
    price_min = django_filters.NumberFilter(field_name='price_sale', lookup_expr='gte')
    price_max = django_filters.NumberFilter(field_name='price_sale', lookup_expr='lte')
    rating_min = django_filters.NumberFilter(field_name='rating', lookup_expr='gte')
    feedbacks_min = django_filters.NumberFilter(field_name='feedbacks', lookup_expr='gte')

    class Meta:
        model = Product
        fields = []


# API товаров
class ProductListView(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = ProductFilter

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            product = serializer.save()
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


# API для парсера
class RunScriptView(APIView):
    def post(self, request):
        name = request.data.get('name')
        page = request.data.get('pages')
        if not name:
            return Response({'error': 'fail'}, status=HTTP_400_BAD_REQUEST)
        try:
            asyncio.run(run_parse(name, page))
            return Response({'result': 'success'}, status=HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)