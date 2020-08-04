from django.contrib import admin
from .models import *


# Register your models here.
class email(admin.ModelAdmin):
    list_display = ("id","user","sender","subject","body","timestamp","read","archived")

admin.site.register(Email,email)