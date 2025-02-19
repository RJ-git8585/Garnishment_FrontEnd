from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.views.generic import TemplateView
from rest_framework.schemas import get_schema_view
from debug_toolbar.toolbar import debug_toolbar_urls

urlpatterns = [
    path('admin/', admin.site.urls),
    path('User/',include('User_app.urls.urls')),
    # path('User/',include('User_app.urls.url_federaltax')),
    path('garnishment', get_schema_view(
        title="Garnishment APIs",
        description="The Garnishment Project API is designed to manage and process employee garnishments efficiently. This API provides secure and streamlined methods for handling garnishment calculations, employee details, and employer data, ensuring compliance with legal requirements.",
        version="1.0.0"
    ), name='garnishment-schema'),

    path('APIWebDoc', TemplateView.as_view(
        template_name='doc.html',
        extra_context={'schema_url':'garnishment-schema'}
    ), name='api_doc'),
    path('__debug__/', include('debug_toolbar.urls')),
]