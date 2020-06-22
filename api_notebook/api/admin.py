from django.contrib import admin
from .models import Task, StickyBoard, StickyNote
# Register your models here.

admin.site.register(Task)
admin.site.register(StickyNote)
admin.site.register(StickyBoard)