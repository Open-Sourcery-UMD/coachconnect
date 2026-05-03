content = open("src/app/routes.ts", "r", encoding="utf-8").read()
if "Messages" not in content:
    content = content.replace(
        "import Contact from './pages/Contact'",
        "import Contact from './pages/Contact'\nimport Messages from './pages/Messages'\nimport Conversation from './pages/Conversation'"
    )
    content = content.replace(
        "  { path: '/contact', Component: Contact },",
        "  { path: '/contact', Component: Contact },\n  { path: '/messages', Component: Messages },\n  { path: '/conversation/:userId', Component: Conversation },"
    )
    open("src/app/routes.ts", "w", encoding="utf-8").write(content)
    print("Done!")
else:
    print("Already has routes!")
