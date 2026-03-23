from django.core.exceptions import ValidationError
from rest_framework import filters


class MaxResultsFilterBackend(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        max_results = request.GET.get("max_results")
        if max_results:
            try:
                limit = int(max_results)
                return queryset[:limit]
            except ValueError:
                raise ValidationError("max_results must be an integer")

        return queryset
