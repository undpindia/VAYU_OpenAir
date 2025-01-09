import os
from datetime import datetime

from django.conf import settings

from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', "aq_undp.settings")

app = Celery('aq_undp')
app.conf.enable_utc = True

app.config_from_object(settings, namespace= 'CELERY')

app.conf.beat_schedule = {
    'insert-record-every-night':{
        'task':'mobile_app.tasks.insert_record_pmtiles',
        'schedule':crontab(minute=1, hour=0),
    }, 
    'insert-heatmap-every-night':{
        'task':'sensor.tasks.insert_heatmap_pmtiles',
        'schedule':crontab(minute=10, hour=0),
    },
    'insert-data-csv-every-midnight':{
        'task':'sensor.tasks.insert_data_download_csv',
        'schedule':crontab(minute=25, hour=18),
    },
    'insert-data-trend-every-night':{
        'task':'sensor.tasks.insert_data_trend',
        'schedule':crontab(minute=1, hour=20),
    },
    'insert-data-daily-csv-every-night':{
        'task':'sensor.tasks.insert_daily_data_download_csv',
        'schedule':crontab(minute=1, hour=23),
    },
}

app.autodiscover_tasks()

@app.task(bind = True)
def debug_task(self):
    print(f'Request: {self.request!r}')