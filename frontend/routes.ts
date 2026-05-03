import { createBrowserRouter } from "react-router";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import CoachOnboarding from "./pages/CoachOnboarding";
import StudentOnboarding from "./pages/StudentOnboarding";
import Results from "./pages/Results";
import MyStudents from "./pages/MyStudents";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/coach/onboarding",
    Component: CoachOnboarding,
  },
  {
    path: "/student/onboarding",
    Component: StudentOnboarding,
  },
  {
    path: "/results",
    Component: Results,
  },
  {
    path: "/my-students",
    Component: MyStudents,
  },
]);