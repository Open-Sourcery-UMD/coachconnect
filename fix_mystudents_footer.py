content = open("src/app/pages/MyStudents.tsx", "r", encoding="utf-8").read()

content = content.replace(
    "    <div className='min-h-screen' style={{ background: 'linear-gradient(135deg, #E21833 0%, #FF6B35 50%, #FFD200 100%)' }}>",
    "    <div className='min-h-screen flex flex-col' style={{ background: 'linear-gradient(135deg, #E21833 0%, #FF6B35 50%, #FFD200 100%)' }}>"
)

content = content.replace(
    "      <Footer />\n    </div>\n  );\n}",
    "      <div className='flex-1'></div>\n      <Footer />\n    </div>\n  );\n}"
)

open("src/app/pages/MyStudents.tsx", "w", encoding="utf-8").write(content)
print("Done!")
