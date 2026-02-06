from django.contrib import admin

from . import models

admin.site.register(models.VariationKind)
admin.site.register(models.Category)
admin.site.register(models.VariationOption)
admin.site.register(models.ProductVariation)


@admin.register(models.WishlistItem)
class WishlistItemAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "product", "added_at"]


@admin.register(models.Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "slug", "base_price", "is_featured"]
    list_editable = ["is_featured"]
