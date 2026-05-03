import { createBrowserRouter } from 'react-router'
import Landing from './pages/Landing'
import Login from './pages/Login'
import CoachOnboarding from './pages/CoachOnboarding'
import StudentOnboarding from './pages/StudentOnboarding'
import Results from './pages/Results'
import MyStudents from './pages/MyStudents'
import About from './pages/About'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Contact from './pages/Contact'
import CalendarPage from './pages/Calendar'
import Messages from './pages/Messages'
import Conversation from './pages/Conversation'

export const router = createBrowserRouter([
  { path: '/', Component: Login },
  { path: '/home', Component: Landing },
  { path: '/login', Component: Login },
  { path: '/coach/onboarding', Component: CoachOnboarding },
  { path: '/student/onboarding', Component: StudentOnboarding },
  { path: '/results', Component: Results },
  { path: '/my-students', Component: MyStudents },
  { path: '/about', Component: About },
  { path: '/terms', Component: Terms },
  { path: '/privacy', Component: Privacy },
  { path: '/contact', Component: Contact },
  { path: '/calendar', Component: CalendarPage },
  { path: '/messages', Component: Messages },
  { path: '/conversation/:userId', Component: Conversation },
])
