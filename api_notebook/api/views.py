from django.shortcuts import render

from .models import Task, StickyNote, StickyBoard

from rest_framework.response import Response
from rest_framework.decorators import api_view

from .serializers import TaskSerializer, StickyNoteSerializer, StickyBoardSerializer, UserDataSerializer

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User

# Create your views here.




@api_view(['GET'])
def overview(request):
    api_urls = {
        'Task':'/get-task/<str:pk>/', #info on the task such as complete, who it belongs to, and its note(what it says)
        'Note':'/get-note/<str:pk>/', #list of tasks in a note
        'Board':'/get-board/<str:pk>/', # list of notes on the board

        'listTasks': '/list-tasks/<str:note_id>/',
        'listNotes': '/list-notes/<str:board_id>/',
        
        'CreateTask':'/create-task/',
        'UpdateTask':'/update-task/',
        'DeleteTask':'/delete-task/',

        'CreateNote':'/create-note/',
        'UpdateNote':'/update-note/',
        'DeleteNote':'/delete-note/',

        'login_view':'/login/',
        'register_view':'/register/',
    }
    return Response(api_urls)



@api_view(['POST'])
def login_view(request):
    serialize = UserDataSerializer(data=request.data)
    serialize.is_valid()
    username = serialize.data.get("username")
    password = serialize.data.get("password")
    user = authenticate(request=None,username=username,password=password)
    if user is not None:
        login(request, user)
        print('user is authenticated')
        #re-serialize user data to send back to front end to utilize id and name
        serialized_user= UserDataSerializer(user)
        return Response(serialized_user.data)
    else:
        return Response(ValueError)

    
    

@api_view(['POST'])
def register_view(request):
    serialize = UserDataSerializer(data=request.data)
    serialize.is_valid()
    username = serialize.data.get("username")
    password = serialize.data.get("password")
    print(username," ",password)
    try:
        user = User.objects.create_user(username,'no email',password)
        print('user registered successfully')
        login(request, user)
        user.save()
        #re-serialize user data to send back to front end to utilize id and name
        serialized_user= UserDataSerializer(user)
        return Response(serialized_user.data)
    except:
        print("failed to create user/ duplicate user")
        return Response(ValueError)



# TASK 
###########################################

@api_view(['GET'])
def listTasks(request,note_id):
    tasks = Task.objects.filter(belongsToNote=note_id)
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getTask(request,pk):
    tasks = Task.objects.get(id=pk)
    serializer = TaskSerializer(tasks)
    return Response(serializer.data)


@api_view(['POST'])
def createTask(request): # ID of note to put on should be passed with the request and list in .data
    serialize = TaskSerializer(data=request.data)
    serialize.is_valid()
    serialize.save()
    return Response(serialize.data)

@api_view(['POST'])
def updateTask(request, pk):
    task = Task.objects.get(id=pk)
    serializer = TaskSerializer(instance=task, data=request.data)
    if serializer.is_valid():
        print(" is valid = true saved instance")
        serializer.save()
    return Response(serializer.data)

@api_view(['DELETE'])
def deleteTask(request, pk):
    task = Task.objects.get(id=pk)
    if task is not None:
        task.delete()
        return Response("Task Deleted")
    else:
        print("task was None")
        return Response("Task failed to delete")


# Note
###########################################

@api_view(['GET'])
def listNotes(request,board_id):
    notes = StickyNote.objects.filter(belongsToBoard=board_id)
    serializer = StickyNoteSerializer(notes, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getNote(request,pk):
    note = StickyNote.objects.get(id=pk)
    serializer = StickyNoteSerializer(note)
    return Response(serializer.data)


@api_view(['POST'])
def createNote(request): # ID of note to put on should be passed with the request and list in .data
    serialize = StickyNoteSerializer(data=request.data)
    serialize.is_valid()
    #print(serialize.data.get('belongsToBoard')," &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& ",serialize.data.get('title'))
    serialize.save()
    return Response(serialize.data)

@api_view(['POST'])
def updateNote(request, pk):
    Note = StickyNote.objects.get(id=pk)
    serialize = StickyNoteSerializer(instance=Note, data=request.data)
    if serialize.is_valid():
        serialize.save()
    return Response(serialize.data)

@api_view(['DELETE'])
def deleteNote(request, pk):
    Note = StickyNote.objects.get(id=pk)
    Note.delete()
    return Response("Note Deleted")


# Board
###############################################

@api_view(['GET'])
def getBoard(request,pk):
    Board = StickyBoard.objects.filter(owner=pk)[0]
    serializer = StickyBoardSerializer(Board)
    return Response(serializer.data)

@api_view(['POST'])
def createBoard(request): # ID of note to put on should be passed with the request and list in .data
    serialize = StickyBoardSerializer(data=request.data)
    if serialize.is_valid():
        serialize.save()
    return Response(serialize.data)

@api_view(['POST'])
def updateBoard(request, pk):
    Board = StickyBoard.objects.get(id=pk)
    serialize = StickyBoardSerializer(instance=Board, data=request.data)
    if serialize.is_valid():
        serialize.save()
    return Response(serialize.data)

@api_view(['DELETE'])
def deleteBoard(request, pk):
    Board = StickyBoard.objects.get(id=pk)
    Board.delete()
    return Response("Board Deleted")