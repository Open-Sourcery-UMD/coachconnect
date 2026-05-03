content = open("src/app/pages/Login.tsx", "r", encoding="utf-8").read()

# Change the outer div to flex column so footer goes below
content = content.replace(
    "    <div className='min-h-screen flex items-center justify-center p-4'>",
    "    <div className='min-h-screen flex flex-col justify-between'>\n      <div className='flex-1 flex items-center justify-center p-4'>"
)

# Close the inner div before footer
content = content.replace(
    "      <Footer />\n    </div>\n  );\n}",
    "      </div>\n      <Footer />\n    </div>\n  );\n}"
)

open("src/app/pages/Login.tsx", "w", encoding="utf-8").write(content)
print("Done!")
