from django.contrib.auth.decorators import login_required
from django.shortcuts import render

@login_required
def dashboard_view(request):
    # Fetch and display service requests here
    service_requests = ServiceRequest.objects.all()
    return render(request, 'dashboard.html', {'service_requests': service_requests})
