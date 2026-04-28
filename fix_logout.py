content = open("src/app/pages/Results.tsx", "r", encoding="utf-8", errors="ignore").read()
content = content.replace(
    "className='border-white/30 text-white hover:bg-white/20'",
    "className='bg-[#E21833] text-white hover:bg-red-700 border-0'"
)
open("src/app/pages/Results.tsx", "w", encoding="utf-8").write(content)
print("Done!")
