content = open("src/app/pages/Messages.tsx", "r", encoding="utf-8").read()
content = content.replace(
    "onClick={() => navigate(-1)}",
    "onClick={() => navigate('/results')}"
)
open("src/app/pages/Messages.tsx", "w", encoding="utf-8").write(content)
print("Done!")
