content = open("src/app/pages/Results.tsx", "r", encoding="utf-8").read()
content = content.replace(
    "if (maxRate !== '' && maxRate !== '0' && parseFloat(coach.rate || '0') > parseFloat(maxRate)) return false;",
    "if (maxRate !== '' && parseFloat(coach.rate || '0') > parseFloat(maxRate)) return false;"
)
open("src/app/pages/Results.tsx", "w", encoding="utf-8").write(content)
print("Done!")
