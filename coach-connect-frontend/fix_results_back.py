content = open("src/app/pages/Results.tsx", "r", encoding="utf-8").read()
content = content.replace(
    """          <Button variant='outline' onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>
            <ArrowLeft className='w-4 h-4 mr-2' />Back
          </Button>""",
    "<div></div>"
)
open("src/app/pages/Results.tsx", "w", encoding="utf-8").write(content)
print("Done!")
