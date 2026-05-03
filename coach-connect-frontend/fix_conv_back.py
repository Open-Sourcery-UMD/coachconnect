content = open("src/app/pages/Conversation.tsx", "r", encoding="utf-8").read()
content = content.replace(
    "onClick={() => navigate('/messages')}",
    "onClick={() => navigate('/messages', { replace: true })}"
)
open("src/app/pages/Conversation.tsx", "w", encoding="utf-8").write(content)
print("Done!")
