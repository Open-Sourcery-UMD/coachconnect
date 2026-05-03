content = open("app/database.py", "r", encoding="utf-8").read()
content = content.replace(
    "from app.models.user import User",
    "from app.models.user import User\nfrom app.models.connection import Connection"
)
content = content.replace(
    "document_models=[User]",
    "document_models=[User, Connection]"
)
open("app/database.py", "w", encoding="utf-8").write(content)
print("Done!")
