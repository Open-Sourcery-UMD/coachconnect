content = open("src/app/utils/api.ts", "r", encoding="utf-8").read()
content = content.replace(
    "export async function saveStudentToDB(formData: any) {",
    """export async function saveStudentToDB(formData: any) {
  console.log('saveStudentToDB called', formData)"""
)
content = content.replace(
    "export async function saveCoachToDB(formData: any) {",
    """export async function saveCoachToDB(formData: any) {
  console.log('saveCoachToDB called', formData)"""
)
open("src/app/utils/api.ts", "w", encoding="utf-8").write(content)
print("Done!")
