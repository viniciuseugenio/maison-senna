import json

from djangorestframework_camel_case.util import underscoreize


def parse_form_data(data):
    """
    Parses and normalizes a raw multipart/form-data field dictionary.
    """
    data = dict(data)

    for key, value in data.items():
        if isinstance(value, list) and len(value) == 1:
            data[key] = value[0]

    json_fields = ["details", "materials", "care", "variation_options"]
    for field in json_fields:
        if field in data and isinstance(data[field], str):
            try:
                parsed = json.loads(data[field])
                data[field] = underscoreize(parsed)
            except json.JSONDecodeError:
                pass

    return data
