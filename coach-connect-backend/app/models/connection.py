from beanie import Document
from pydantic import Field
from typing import Optional
from datetime import datetime

class Connection(Document):
    coach_id: str
    student_id: str
    coach_name: str
    student_name: str
    student_email: str
    sport: Optional[str] = None
    status: str = 'active'
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = 'connections'
