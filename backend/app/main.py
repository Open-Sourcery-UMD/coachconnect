from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import init_db
from app.routers import users, connections

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield

app = FastAPI(title='Coach Connect API', lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(users.router, prefix='/users', tags=['Users'])
app.include_router(connections.router, prefix='/connections', tags=['Connections'])

@app.get('/')
def root():
    return {'message': 'Coach Connect API is running'}
