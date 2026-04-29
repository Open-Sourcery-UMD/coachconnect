import { createBrowserRouter } from 'react-router'
import Landing from './pages/Landing'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import CoachOnboarding from './pages/CoachOnboarding'
import StudentOnboarding from './pages/StudentOnboarding'
import Results from './pages/Results'
import MyStudents from './pages/MyStudents'
import About from './pages/About'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Contact from './pages/Contact'

export const router = createBrowserRouter([
  { path: '/', Component: Login },
  { path: '/home', Component: Landing },
  { path: '/login', Component: Login },
  { path: '/forgot-password', Component: ForgotPassword },
  { path: '/coach/onboarding', Component: CoachOnboarding },
  { path: '/student/onboarding', Component: StudentOnboarding },
  { path: '/results', Component: Results },
  { path: '/my-students', Component: MyStudents },
  { path: '/about', Component: About },
  { path: '/terms', Component: Terms },
  { path: '/privacy', Component: Privacy },
  { path: '/contact', Component: Contact },
])
