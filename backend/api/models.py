from django.db import models


class Product(models.Model):
    name = models.CharField(max_length=255)
    price_basic = models.FloatField()
    price_sale = models.FloatField(blank=True, null=True)
    rating = models.FloatField(blank=True, null=True)
    feedbacks = models.IntegerField(default=0)
    image = models.ImageField(upload_to='product/', default='product/default.png')

    def __str__(self):
        return self.name

