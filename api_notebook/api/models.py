from django.conf import settings

from django.db import models

from django.contrib.auth.models import User



class Task(models.Model):
    #id = default uuid
    belongsToNote = models.ForeignKey('StickyNote', on_delete=models.CASCADE)
    info = models.CharField(max_length=500)
    completed = models.BooleanField(default=False, blank=True, null=True)

    # def __str__(self):
    #     return self.info

class StickyNote(models.Model):
    # id = default UUID
    title = models.CharField(max_length=200)
    #which board does this board belong to
    belongsToBoard = models.ForeignKey('StickyBoard', on_delete=models.CASCADE) #cascade deletes this sticky when all tasks are gone
    # def __str__(self):
    #     return self.title

class StickyBoard(models.Model):
    # id = default uuid
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    # def __str__(self):
    #     return self.owner

    





