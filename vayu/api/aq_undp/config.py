DATABASES = {
       'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': 'aq_undp_db',
            'USER': 'postgres',
            'PASSWORD': 'root',
            'HOST': 'localhost',
            'PORT': '5432',
       }
   }

ALLOWED_HOSTS = ["127.0.0.1", "localhost"]

DOMAIN_NAME = 'http://localhost:8000'
