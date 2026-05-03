from fastapi import APIRouter, HTTPException
from app.models.connection import Connection

router = APIRouter()

@router.post('/')
async def create_connection(data: dict):
    existing = await Connection.find_one(
        Connection.coach_id == data['coach_id'],
        Connection.student_id == data['student_id']
    )
    if existing:
        return {'message': 'Already connected', 'id': str(existing.id)}
    conn = Connection(**data)
    await conn.insert()
    return {'message': 'Connection created', 'id': str(conn.id)}

@router.get('/coach/{coach_id}')
async def get_coach_connections(coach_id: str):
    connections = await Connection.find(Connection.coach_id == coach_id).to_list()
    result = []
    for c in connections:
        d = c.dict()
        d['id'] = str(c.id)
        result.append(d)
    return result

@router.get('/student/{student_id}')
async def get_student_connections(student_id: str):
    connections = await Connection.find(Connection.student_id == student_id).to_list()
    result = []
    for c in connections:
        d = c.dict()
        d['id'] = str(c.id)
        result.append(d)
    return result

@router.delete('/{connection_id}')
async def delete_connection(connection_id: str):
    conn = await Connection.get(connection_id)
    if not conn:
        raise HTTPException(status_code=404, detail='Connection not found')
    await conn.delete()
    return {'message': 'Connection deleted'}
