content = open("app/routers/users.py", "r", encoding="utf-8").read()
content = content.replace(
    "@router.get('/{auth0_id}')\nasync def get_user(auth0_id: str, token: dict = Depends(verify_token)):",
    "@router.get('/{auth0_id}')\nasync def get_user(auth0_id: str):"
)
open("app/routers/users.py", "w", encoding="utf-8").write(content)
print("Done!")
