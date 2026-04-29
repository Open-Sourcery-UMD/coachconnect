import { auth } from '../firebase'

const API_URL = 'http://localhost:8000'

export async function saveCoachToDB(formData: any) {
  console.log('saveCoachToDB called', formData)
  const user = auth.currentUser
  if (!user) throw new Error('Not logged in')
  const token = await user.getIdToken()

  const response = await fetch(API_URL + '/users/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({
      auth0_id: user.uid,
      email: user.email || formData.email,
      name: formData.name,
      phone: formData.phone,
      gender: formData.gender,
      role: 'coach',
      expertise: formData.expertise,
      coaching_style: formData.coachingStyle,
      competition_level: formData.competitionLevel || [],
      certification: formData.certification || '',
      rate: formData.rate || '',
      availability: formData.availability || [],
    })
  })
  const data = await response.json()
  console.log('saveCoachToDB response', data)
  return data
}

export async function saveStudentToDB(formData: any) {
  console.log('saveStudentToDB called', formData)
  const user = auth.currentUser
  if (!user) throw new Error('Not logged in')
  const token = await user.getIdToken()

  const response = await fetch(API_URL + '/users/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({
      auth0_id: user.uid,
      email: user.email || formData.email,
      name: formData.name,
      phone: formData.phone,
      gender: formData.gender,
      role: 'student',
      interests: formData.interests,
      level: formData.level,
      goals: formData.goals,
      budget: formData.budget,
      preferred_times: formData.preferredTimes || [],
      graduation_year: formData.graduationYear,
    })
  })
  const data = await response.json()
  console.log('saveStudentToDB response', data)
  return data
}

export async function getCoaches(filters?: any) {
  let url = API_URL + '/users/coaches'
  const response = await fetch(url)
  return response.json()
}

export async function getUserProfile(firebaseUid: string) {
  try {
    const response = await fetch(API_URL + '/users/' + firebaseUid)
    if (response.status === 404) return null
    return await response.json()
  } catch (err) {
    return null
  }
}

export async function getStudents() {
  const response = await fetch(API_URL + '/users/students')
  return response.json()
}
