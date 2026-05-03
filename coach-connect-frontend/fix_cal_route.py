# Add route
content = open("src/app/routes.ts", "r", encoding="utf-8").read()
if "Calendar" not in content:
    content = content.replace(
        "import Contact from './pages/Contact'",
        "import Contact from './pages/Contact'\nimport CalendarPage from './pages/Calendar'"
    )
    content = content.replace(
        "  { path: '/contact', Component: Contact },",
        "  { path: '/contact', Component: Contact },\n  { path: '/calendar', Component: CalendarPage },"
    )
    open("src/app/routes.ts", "w", encoding="utf-8").write(content)
    print("Routes done!")

# Update Calendar tab in MyStudents to navigate to /calendar
content = open("src/app/pages/MyStudents.tsx", "r", encoding="utf-8").read()
content = content.replace(
    "onClick={() => setActiveTab('calendar')}",
    "onClick={() => navigate('/calendar')}"
)
open("src/app/pages/MyStudents.tsx", "w", encoding="utf-8").write(content)
print("MyStudents done!")
