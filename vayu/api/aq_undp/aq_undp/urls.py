"""aq_undp URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
import django.views.defaults

from rest_framework_simplejwt.views import TokenRefreshView

from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from user.views import CustomTokenObtainPairView
from mobile_app.views import get_district, get_state

import config

schema_view = get_schema_view(
    openapi.Info(
        title="API",
        default_version='v1',
        description="Test description",
        contact=openapi.Contact(email="rashmi@misteo.co"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

swagger_url_patterns = [
    re_path(
        r"^doc(?P<format>\.json|\.yaml)$",
        schema_view.without_ui(cache_timeout=0),
        name="schema-json",
    ),
    path(
        "doc/",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    path(
        "redoc/", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"
    ),
]

# Adds site header, site title, index title to the admin side.
admin.site.site_header = 'VAYU administration'
admin.site.site_title = 'VAYU'
admin.site.site_url = config.DOMAIN_NAME + '/admin'

def custom_page_not_found(request):
    return django.views.defaults.page_not_found(request, None, template_name="404.html")

urlpatterns = (
    [
        path('admin/', admin.site.urls),
        path('api/v1/login', CustomTokenObtainPairView.as_view(),
             name='token_obtain_pair'),
        path('api/v1/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
        path('user/', include('user.urls')),
        path('device/', include('sensor.urls')),
        path('mobile/', include('mobile_app.urls')),
        path("", custom_page_not_found),
        # use for dropdown menu in Task model
        path('get_district/', get_district, name='get_district'),
        path('get_state/', get_state, name='get_state'),
    ]
    + swagger_url_patterns
)


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL,
             document_root=settings.STATIC_ROOT)
