from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)
    parent = models.ForeignKey(
        "self", null=True, blank=True, on_delete=models.CASCADE, related_name="children"
    )

    class Meta:
        verbose_name_plural = "categories"

    def __str__(self):
        return f"{self.name}"


class Product(models.Model):
    category = models.ForeignKey(
        Category, on_delete=models.PROTECT, related_name="products"
    )
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    reference_image = models.ImageField(
        upload_to="catalog/products/", blank=True, null=True
    )

    details = models.JSONField(default=list)
    materials = models.JSONField(default=list)
    care = models.JSONField(default=list)

    def __str__(self):
        return f"{self.name}"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)

        return super().save(*args, **kwargs)


class VariationKind(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return f"{self.name}"


class VariationType(models.Model):
    kind = models.ForeignKey(
        VariationKind, on_delete=models.CASCADE, related_name="variation_type"
    )
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="variation_types"
    )

    def __str__(self):
        return f"{self.kind} for {self.product}"


class VariationOption(models.Model):
    type = models.ForeignKey(
        VariationType, on_delete=models.CASCADE, related_name="options"
    )
    name = models.CharField(max_length=50)
    price_modifier = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )

    def __str__(self):
        return f"{self.name} - {self.type}"


class ProductVariation(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="variations"
    )
    sku = models.CharField(max_length=100, unique=True)
    stock = models.PositiveIntegerField()
    image = models.ImageField(upload_to="variations/", blank=True, null=True)
    options = models.ManyToManyField(VariationOption, related_name="product_variations")

    def __str__(self):
        return f"{self.sku}"
