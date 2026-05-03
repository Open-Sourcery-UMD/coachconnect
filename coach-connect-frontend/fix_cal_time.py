content = open("src/app/pages/Calendar.tsx", "r", encoding="utf-8").read()

# Fix isUpcoming - just compare date since time is stored as "6pm-7pm" not HH:MM
content = content.replace(
    "  const isUpcoming = (dateStr: string, timeStr: string) => {\n    return new Date(dateStr + 'T' + timeStr) > new Date();\n  };",
    "  const isUpcoming = (dateStr: string) => {\n    const sessionDate = new Date(dateStr + 'T23:59:59');\n    return sessionDate >= new Date(new Date().toDateString());\n  };"
)

# Fix upcoming/past filter calls
content = content.replace(
    "  const upcoming = sessions.filter(s => isUpcoming(s.date, s.time));",
    "  const upcoming = sessions.filter(s => isUpcoming(s.date));"
)
content = content.replace(
    "  const past = sessions.filter(s => !isUpcoming(s.date, s.time));",
    "  const past = sessions.filter(s => !isUpcoming(s.date));"
)

# Fix time display - show time slot directly not formatted
content = content.replace(
    "{formatDate(session.date)} at {formatTime(session.time)}",
    "{formatDate(session.date)} | {session.time}"
)

open("src/app/pages/Calendar.tsx", "w", encoding="utf-8").write(content)
print("Done!")
