from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class UserRole(BaseModel):
    role: str

@app.post("/api/get-dashboard-route")
def get_dashboard_route(user: UserRole):
    
    role_map = {
        'admin': '/dashboards/admin',
        'farmer': '/dashboards/farmer',
        'inspector': '/modules/inspector/inspections',
        'transporter': '/dashboards/transporter',
        'packaging': '/dashboards/packaging',
        'customer': '/dashboards/customer',
    }
    
    user_role = user.role.lower()
    if user_role in role_map:
        return {"redirect_url": role_map[user_role]}
    
    return {"redirect_url": "/"} 

