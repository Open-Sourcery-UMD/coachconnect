from beanie import Document
from pydantic import Field
from datetime import datetime

class Appointment(Document):
    coach_id: str
    student_id: str
    coach_name: str
    student_name: str
    slot: str
    status: str = 'pending'
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = 'appointments'