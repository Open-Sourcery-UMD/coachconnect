content = open("src/app/pages/Calendar.tsx", "r", encoding="utf-8").read()

# Wrap everything in one gradient div including footer
content = content.replace(
    "    <>\n    <div className='min-h-screen flex flex-col' style={{ background: 'linear-gradient(135deg, #E21833 0%, #FF6B35 50%, #FFD200 100%)' }}>",
    "    <div className='min-h-screen flex flex-col' style={{ background: 'linear-gradient(135deg, #E21833 0%, #FF6B35 50%, #FFD200 100%)' }}>"
)
content = content.replace(
    "      <div className='flex-1'></div>\n    </div>\n    <Footer />\n    </>",
    "      <div className='flex-1'></div>\n      <Footer />\n    </div>"
)

open("src/app/pages/Calendar.tsx", "w", encoding="utf-8").write(content)
print("Done!")
