from django.contrib import admin

from . import models

admin.site.register(models.VariationKind)
admin.site.register(models.Category)
admin.site.register(models.Product)
admin.site.register(models.VariationOption)
admin.site.register(models.VariationType)
admin.site.register(models.ProductVariation)
