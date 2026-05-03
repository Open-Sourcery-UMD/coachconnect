content = open("src/app/pages/Calendar.tsx", "r", encoding="utf-8").read()
content = content.replace(
    "    <div className='min-h-screen' style={{ background: 'linear-gradient(135deg, #E21833 0%, #FF6B35 50%, #FFD200 100%)' }}>",
    "    <div className='min-h-screen flex flex-col' style={{ background: 'linear-gradient(135deg, #E21833 0%, #FF6B35 50%, #FFD200 100%)' }}>"
)
content = content.replace(
    "      </div>\n    </div>\n    <Footer />",
    "      </div>\n      <div className='flex-1'></div>\n    </div>\n    <Footer />"
)
open("src/app/pages/Calendar.tsx", "w", encoding="utf-8").write(content)
print("Done!")
