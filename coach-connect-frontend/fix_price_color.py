content = open("src/app/pages/Results.tsx", "r", encoding="utf-8").read()
content = content.replace(
    "style={{ color: '#E21833' }}>${selectedCoach.rate || '0'}",
    "style={{ color: '#111111' }}>${selectedCoach.rate || '0'}"
)
open("src/app/pages/Results.tsx", "w", encoding="utf-8").write(content)
print("Done!")
