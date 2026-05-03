from fastapi import APIRouter, HTTPException, Depends
from app.models.user import User
from app.schemas.user import UserCreate
from app.auth0 import verify_token

router = APIRouter()

@router.post('/')
async def create_user(user_data: UserCreate, token: dict = Depends(verify_token)):
    existing = await User.find_one(User.auth0_id == user_data.auth0_id)
    if existing:
        raise HTTPException(status_code=400, detail='User already exists')
    user = User(**user_data.model_dump())
    await user.insert()
    return {'message': 'User created successfully', 'id': str(user.id)}

@router.get('/coaches')
async def get_coaches(sport: str = None, level: str = None, max_rate: float = None):
    coaches = await User.find(User.role == 'coach').to_list()
    if sport:
        coaches = [c for c in coaches if sport in (c.expertise or [])]
    if level:
        coaches = [c for c in coaches if level in (c.competition_level or [])]
    if max_rate:
        coaches = [c for c in coaches if c.rate and float(c.rate) <= max_rate]
    result = []
    for c in coaches:
        d = c.dict()
        d['id'] = str(c.id)
        result.append(d)
    return result

@router.get('/coaches/{coach_id}')
async def get_coach(coach_id: str):
    coach = await User.get(coach_id)
    if not coach or coach.role != 'coach':
        raise HTTPException(status_code=404, detail='Coach not found')
    d = coach.dict()
    d['id'] = str(coach.id)
    return d

@router.get('/me')
async def get_me(token: dict = Depends(verify_token)):
    auth0_id = token['sub']
    user = await User.find_one(User.auth0_id == auth0_id)
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    d = user.dict()
    d['id'] = str(user.id)
    return d

@router.get('/{auth0_id}')
async def get_user(auth0_id: str):
    user = await User.find_one(User.auth0_id == auth0_id)
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    d = user.dict()
    d['id'] = str(user.id)
    return d


@router.get('/students')
async def get_students():
    students = await User.find(User.role == 'student').to_list()
    result = []
    for s in students:
        d = s.dict()
        d['id'] = str(s.id)
        result.append(d)
    return result
