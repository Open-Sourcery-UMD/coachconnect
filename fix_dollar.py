content = open("src/app/pages/Results.tsx", "r", encoding="utf-8").read()

# Add dollar sign to card rate
content = content.replace(
    "                        <p className='text-xl font-bl",
    "PLACEHOLDER"
)
idx = content.find("PLACEHOLDER")
end = content.find("</p>", idx)
snippet = content[idx:end]
print("Found:", repr(snippet))
content = content.replace("PLACEHOLDER", "                        <p className='text-xl font-bl")
open("src/app/pages/Results.tsx", "w", encoding="utf-8").write(content)
