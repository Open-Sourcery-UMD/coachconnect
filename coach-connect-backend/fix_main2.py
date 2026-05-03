content = open("app/main.py", "r", encoding="utf-8").read()
content = content.replace(
    "app.include_router(users.router, prefix='/users', tags=['Users'])",
    "app.include_router(users.router, prefix='/users', tags=['Users'])\napp.include_router(connections.router, prefix='/connections', tags=['Connections'])"
)
open("app/main.py", "w", encoding="utf-8").write(content)
print("Done!")
