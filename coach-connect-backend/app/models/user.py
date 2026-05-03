from beanie import Document
from typing import Optional, List, Literal
from pydantic import EmailStr

class User(Document):
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

    class Settings:
        name = "users"
