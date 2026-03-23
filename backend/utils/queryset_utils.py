def limit_queryset(request, queryset):
    limit = request.GET.get("limit")
    if limit:
        try:
            limit = int(limit)
            queryset = queryset[:limit]
        except ValueError:
            pass

    return queryset
