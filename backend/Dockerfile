FROM python:3.14.2-slim

RUN apt-get update && apt-get install -y \
  default-mysql-client \
  pkg-config \
  default-libmysqlclient-dev gcc \
  libtiff5-dev libjpeg62-turbo-dev libopenjp2-7-dev zlib1g-dev \
  libfreetype6-dev liblcms2-dev libwebp-dev tcl8.6-dev tk8.6-dev python3-tk \
  libharfbuzz-dev libfribidi-dev libxcb1-dev \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY requirements.txt ./

RUN pip install --upgrade pip \ 
  && pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

