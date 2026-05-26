import asyncio, os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
load_dotenv()

async def update():
    client = AsyncIOMotorClient(os.getenv("MONGODB_URL"))
    db = client[os.getenv("DB_NAME")]
    users = db["users"]
    coaches = await users.find({"role": "coach"}).to_list(None)
    for coach in coaches:
        sport_details = {}
        for sport in (coach.get("expertise") or []):
            sport_details[sport] = {
                "coachingYears": "3",
                "playingYears": "8",
                "achievements": "Varsity team captain, regional tournament finalist, 2 years competitive experience"
            }
        await users.update_one(
            {"_id": coach["_id"]},
            {"$set": {"sport_details": sport_details}}
        )
        print(f"Updated {coach['name']}")
    print("Done")
    client.close()

asyncio.run(update())
