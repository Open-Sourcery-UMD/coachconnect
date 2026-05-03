from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.models.user import User
from app.models.connection import Connection
import os
from dotenv import load_dotenv

load_dotenv()

async def init_db():
    client = AsyncIOMotorClient(os.getenv("MONGODB_URL"))
    await init_beanie(
        database=client[os.getenv("DB_NAME")],
        document_models=[User, Connection]
    )