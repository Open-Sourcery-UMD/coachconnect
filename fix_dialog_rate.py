content = open("src/app/pages/Results.tsx", "r", encoding="utf-8").read()

# Fix card - remove extra /hour line
content = content.replace(
    "{coach.rate || '0'}/hr</p>\n                        <p className='text-xs text-gray-500'>/hour</p>",
    "{coach.rate || '0'}/hr</p>"
)

# Fix dialog rate
content = content.replace(
    "<p className='text-3xl font-black'></p>\n                    <p className='text-sm text-gray-500'>/hour</p>",
    "<p className='text-3xl font-black'>${selectedCoach.rate || '0'}/hr</p>"
)

open("src/app/pages/Results.tsx", "w", encoding="utf-8").write(content)
print("Done!")
