from django.contrib import admin
from django.urls import path, include
from . import views


urlpatterns = [
    path('', views.overview, name ="overview" ),
    path('get-task/<str:pk>/', views.getTask, name='getTask'),
    path('get-note/<str:pk>/', views.getNote, name='getNote'),
    path('get-board/<str:pk>/', views.getBoard, name='getBoard'),

    path('login/', views.login_view, name ='login_view'),
    path('register/', views.register_view, name='register_view'),

    path('list-tasks/<str:note_id>/', views.listTasks, name='listTasks'),
    path('list-notes/<str:board_id>/', views.listNotes, name='listNotes'),

    path('create-task/', views.createTask, name='createTask'),
    path('create-note/', views.createNote, name='createNote'),
    path('create-board/', views.createBoard, name='createBoard'),

    path('update-task/<str:pk>/', views.updateTask, name='updateTask'),
    path('update-note/<str:pk>/', views.updateNote, name='updateNote'),
    path('update-board/<str:pk>/', views.updateBoard, name='updateBoard'),

    path('delete-task/<str:pk>/', views.deleteTask, name='deleteTask'),
    path('delete-note/<str:pk>/', views.deleteNote, name='deleteNote'),
    path('delete-board/<str:pk>/', views.deleteBoard, name='deleteBoard'),



]