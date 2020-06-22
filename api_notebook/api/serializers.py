from rest_framework import serializers
from .models import Task, StickyBoard,StickyNote
from django.contrib.auth import authenticate, login, logout

from django.contrib.auth.models import User


class TaskSerializer(serializers.ModelSerializer): #turns data into python native
    class Meta: #just take all the stuff from task and serialize it
        model = Task #from our models
        fields = '__all__'

class StickyNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = StickyNote
        fields = ['id','title','belongsToBoard']

class StickyBoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = StickyBoard
        fields = ['id','owner']

class UserDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','password']