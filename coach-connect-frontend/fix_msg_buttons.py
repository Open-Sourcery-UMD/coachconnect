import re

# Add to Results page
content = open("src/app/pages/Results.tsx", "r", encoding="utf-8").read()
if "messages" not in content:
    content = content.replace(
        "import { LogOut,",
        "import { LogOut, MessageCircle,"
    )
    content = content.replace(
        "<Button variant='outline' onClick={handleLogout}",
        "<Button onClick={() => navigate('/messages')} className='mr-2' style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}>\n          <MessageCircle className='w-4 h-4 mr-2' />Messages\n        </Button>\n        <Button variant='outline' onClick={handleLogout}"
    )
    open("src/app/pages/Results.tsx", "w", encoding="utf-8").write(content)
    print("Results done!")

# Add to MyStudents page
content = open("src/app/pages/MyStudents.tsx", "r", encoding="utf-8").read()
if "/messages" not in content:
    content = content.replace(
        "import { LogOut, Mail, Phone, Users, Calendar } from 'lucide-react';",
        "import { LogOut, Mail, Phone, Users, Calendar, MessageCircle } from 'lucide-react';"
    )
    content = content.replace(
        "<Button onClick={handleLogout}",
        "<Button onClick={() => navigate('/messages')} className='mr-2' style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}>\n          <MessageCircle className='w-4 h-4 mr-2' />Messages\n        </Button>\n        <Button onClick={handleLogout}"
    )
    open("src/app/pages/MyStudents.tsx", "w", encoding="utf-8").write(content)
    print("MyStudents done!")
