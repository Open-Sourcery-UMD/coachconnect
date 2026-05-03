content = open("app/main.py", "r", encoding="utf-8").read()
content = content.replace(
    "from app.routers import users",
    "from app.routers import users, connections"
)
content = content.replace(
    "app.include_router(users.router, prefix='/users')",
    "app.include_router(users.router, prefix='/users')\napp.include_router(connections.router, prefix='/connections')"
)
open("app/main.py", "w", encoding="utf-8").write(content)
print("Done!")
