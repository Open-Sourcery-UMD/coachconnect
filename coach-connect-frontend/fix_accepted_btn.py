content = open("src/app/pages/Conversation.tsx", "r", encoding="utf-8").read()
content = content.replace(
    "Accepted ?' : 'Accept Student'",
    "Accepted' : 'Accept Student'"
)
open("src/app/pages/Conversation.tsx", "w", encoding="utf-8").write(content)
print("Done!")
