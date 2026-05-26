import asyncio, os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
load_dotenv()

async def migrate():
    client = AsyncIOMotorClient(os.getenv("MONGODB_URL"))
    db = client[os.getenv("DB_NAME")]
    users = db["users"]
    coaches = await users.find({"role": "coach"}).to_list(None)
    print(f"Found {len(coaches)} coaches")
    for coach in coaches:
        if "sport_details" not in coach or not coach["sport_details"]:
            sport_details = {}
            for sport in (coach.get("expertise") or []):
                sport_details[sport] = {"coachingYears": "0", "playingYears": "0", "achievements": ""}
            await users.update_one(
                {"_id": coach["_id"]},
                {"$set": {"sport_details": sport_details}}
            )
            print(f"Updated {coach['name']} with sports: {list(sport_details.keys())}")
    print("Done")
    client.close()

asyncio.run(migrate())
