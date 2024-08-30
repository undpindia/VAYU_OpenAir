from django import forms
from .models import Task


class TaskCreationForm(forms.ModelForm):
    class Meta():
        model = Task
        exclude = ['status']

class TaskChangeForm(forms.ModelForm):
    class Meta():
        model = Task
        fields = '__all__'
