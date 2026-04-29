content = open("src/app/components/Footer.tsx", "r", encoding="utf-8", errors="ignore").read()
content = content.replace(
    "<span className='block text-white/70 text-sm cursor-pointer hover:text-white'>Terms of Service</span>",
    "<a href='/terms' className='block text-white/70 text-sm hover:text-white transition-colors'>Terms of Service</a>"
)
content = content.replace(
    "<span className='block text-white/70 text-sm cursor-pointer hover:text-white'>Privacy Policy</span>",
    "<a href='/privacy' className='block text-white/70 text-sm hover:text-white transition-colors'>Privacy Policy</a>"
)
content = content.replace(
    "<span className='block text-white/70 text-sm cursor-pointer hover:text-white'>Contact Us</span>",
    "<a href='/contact' className='block text-white/70 text-sm hover:text-white transition-colors'>Contact Us</a>"
)
open("src/app/components/Footer.tsx", "w", encoding="utf-8").write(content)
print("Done!")
