from pydantic import BaseModel, EmailStr
from typing import Optional, List, Literal

class UserCreate(BaseModel):
    auth0_id: str
    email: EmailStr
    name: str
    phone: Optional[str] = None
    gender: Optional[str] = None
    role: Literal["coach", "student"]

    # Coach specific
    expertise: Optional[List[str]] = []
    coaching_style: Optional[str] = None
    competition_level: Optional[List[str]] = []
    certification: Optional[str] = None
    rate: Optional[str] = None
    availability: Optional[List[str]] = []

    # Student specific
    graduation_year: Optional[str] = None
    interests: Optional[List[str]] = []
    level: Optional[str] = None
    goals: Optional[str] = None
    budget: Optional[str] = None
    preferred_times: Optional[List[str]] = []

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str