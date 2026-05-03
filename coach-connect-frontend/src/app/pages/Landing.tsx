import { useNavigate } from "react-router";
import Footer from "../components/Footer";
import { auth } from "../firebase";
import { getUserProfile } from "../utils/api";
import { useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { GraduationCap, Users } from "lucide-react";
import { loadSampleCoaches } from "../utils/sampleCoaches";

export default function Landing() {
  const navigate = useNavigate();

  // Load sample coaches on component mount
  useEffect(() => {
    loadSampleCoaches();
  }, []);

  return (
    <>
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Shell pattern background */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="shell-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <g transform="translate(60, 60)">
                {/* Shell shape */}
                <path d="M 0,-30 Q 20,-25 25,-10 Q 28,0 25,10 Q 20,25 0,30 Q -20,25 -25,10 Q -28,0 -25,-10 Q -20,-25 0,-30 Z" 
                      fill="white" opacity="0.6"/>
                <path d="M 0,-25 L 0,25 M -15,-15 L 15,15 M 15,-15 L -15,15 M -20,0 L 20,0" 
                      stroke="white" strokeWidth="1.5" opacity="0.4"/>
                <circle cx="0" cy="0" r="5" fill="white" opacity="0.8"/>
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#shell-pattern)"/>
        </svg>
      </div>

      <div className="max-w-5xl w-full space-y-12 relative z-10">
        <div className="text-center space-y-4">
          <h1 className="text-6xl text-white font-black drop-shadow-2xl tracking-tight" style={{ fontFamily: 'Apple Chancery, cursive' }}>
            Coach Connect
          </h1>
          <p className="text-xl text-white/90 drop-shadow-lg font-light tracking-wide">
            Connecting coaches with UMD students for private lessons
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Coach Card - Glassmorphism */}
          <div
            className="rounded-2xl coach-card"
            style={{
              background: 'rgba(20, 20, 25, 0.4)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
            }}
          >
            <div className="p-8 space-y-6">
              <div className="text-center space-y-4">
                <div 
                  className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4"
                  style={{
                    background: 'rgba(226, 24, 51, 0.2)',
                    border: '2px solid rgba(226, 24, 51, 0.4)'
                  }}
                >
                  <Users className="w-10 h-10 text-[#E21833]" />
                </div>
                <h2 className="text-3xl text-white">Sign Up as Coach</h2>
                <p className="text-white/70">Find students to teach</p>
              </div>

              <ul className="space-y-3 text-white/80 h-32 pointer-events-none">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E21833]"></div>
                  <span>Create your coaching profile</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E21833]"></div>
                  <span>Offer private lessons</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E21833]"></div>
                  <span>Connect with interested students</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E21833]"></div>
                  <span>Build your coaching practice</span>
                </li>
              </ul>

              <Button
                onClick={async () => {
                  const user = auth.currentUser;
                  if (user) {
                    const profile = await getUserProfile(user.uid);
                    if (profile) { navigate("/results"); return; }
                  }
                  navigate("/coach/onboarding");
                }}
                className="w-full text-white font-semibold text-lg py-6 rounded-3xl transition-all duration-300 hover:shadow-lg hover:shadow-[#E21833]/50 border-0 hover:scale-105 coach-button"
                style={{
                  background: '#E21833',
                  cursor: 'pointer'
                }}
                size="lg"
              >
                Get Started as Coach
              </Button>
            </div>
          </div>

          {/* Student Card - Glassmorphism */}
          <div
            className="rounded-2xl student-card"
            style={{
              background: 'rgba(20, 20, 25, 0.4)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
            }}
          >
            <div className="p-8 space-y-6">
              <div className="text-center space-y-4">
                <div 
                  className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4"
                  style={{
                    background: 'rgba(255, 210, 0, 0.2)',
                    border: '2px solid rgba(255, 210, 0, 0.4)'
                  }}
                >
                  <GraduationCap className="w-10 h-10 text-[#FFD200]" />
                </div>
                <h2 className="text-3xl text-white">Sign Up as Student</h2>
                <p className="text-white/70">Find private coaches</p>
              </div>

              <ul className="space-y-3 text-white/80 h-32 pointer-events-none">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FFD200]"></div>
                  <span>Browse qualified coaches</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FFD200]"></div>
                  <span>Book private lessons</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FFD200]"></div>
                  <span>Set your athletic goals</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FFD200]"></div>
                  <span>Start training today!</span>
                </li>
              </ul>

              <Button
                onClick={async () => {
                  const user = auth.currentUser;
                  if (user) {
                    const profile = await getUserProfile(user.uid);
                    if (profile) { navigate("/results"); return; }
                  }
                  navigate("/student/onboarding");
                }}
                className="w-full text-black font-semibold text-lg py-6 rounded-3xl transition-all duration-300 hover:shadow-lg hover:shadow-[#FFD200]/50 border-0 hover:scale-105 student-button"
                style={{
                  background: '#FFD200',
                  cursor: 'pointer'
                }}
                size="lg"
              >
                Get Started as Student
              </Button>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .coach-card:hover .coach-benefits {
          opacity: 1;
        }
        
        .student-card:hover .student-benefits {
          opacity: 1;
        }
      `}</style>
    </div>
    <Footer />
    </>
  );
}
