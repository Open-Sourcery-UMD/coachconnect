from fastapi import APIRouter, HTTPException
from app.models.appointment import Appointment

router = APIRouter()

def _serialize(a: Appointment) -> dict:
    d = a.dict()
    d['id'] = str(a.id)
    return d

@router.post('/')
async def create_appointment(data: dict):
    appt = Appointment(**data)
    await appt.insert()
    return {'message': 'Appointment requested', 'id': str(appt.id)}

@router.get('/coach/{coach_id}')
async def get_coach_appointments(coach_id: str):
    appts = await Appointment.find(Appointment.coach_id == coach_id).to_list()
    return [_serialize(a) for a in appts]

@router.get('/student/{student_id}')
async def get_student_appointments(student_id: str):
    appts = await Appointment.find(Appointment.student_id == student_id).to_list()
    return [_serialize(a) for a in appts]

@router.patch('/{appointment_id}/accept')
async def accept_appointment(appointment_id: str):
    appt = await Appointment.get(appointment_id)
    if not appt:
        raise HTTPException(status_code=404, detail='Appointment not found')
    appt.status = 'accepted'
    await appt.save()
    return {'message': 'Appointment accepted'}

@router.patch('/{appointment_id}/decline')
async def decline_appointment(appointment_id: str):
    appt = await Appointment.get(appointment_id)
    if not appt:
        raise HTTPException(status_code=404, detail='Appointment not found')
    appt.status = 'declined'
    await appt.save()
    return {'message': 'Appointment declined'}
@router.delete('/coach/{coach_id}/student/{student_id}')
async def delete_appointments_between(coach_id: str, student_id: str):
    appts = await Appointment.find(Appointment.coach_id == coach_id, Appointment.student_id == student_id).to_list()
    for appt in appts:
        await appt.delete()
    return {'message': f'Deleted {len(appts)} appointments'}
