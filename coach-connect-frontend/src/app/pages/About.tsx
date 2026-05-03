import { useNavigate } from "react-router";
import Footer from '../components/Footer';
import { Button } from "../components/ui/button";
import { ArrowLeft, Users, Target, Heart, HelpCircle } from "lucide-react";
import { useState } from "react";

export default function About() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How does Coach Connect work?",
      answer: "Coach Connect matches UMD students with experienced coaches based on their sport interests. Students create a profile, select their sports, and browse matched coaches. Coaches create profiles showcasing their expertise, availability, and rates. Once matched, students can view detailed profiles and connect directly with coaches."
    },
    {
      question: "Who can join as a coach?",
      answer: "We welcome experienced coaches with a background in club sports, collegiate athletics, or professional coaching. Coaches should have verifiable experience, relevant certifications, and a passion for helping students develop their athletic skills."
    },
    {
      question: "How much does it cost?",
      answer: "Coach Connect is free to join for both students and coaches. Coaches set their own hourly rates, which typically range from $50-$120 per hour depending on their experience and expertise. Students pay coaches directly for training sessions."
    },
    {
      question: "What sports are available?",
      answer: "We support a wide range of club sports including Tennis, Volleyball, Soccer, Basketball, Swimming, Baseball, Track and Field, Lacrosse, Rugby, Ultimate Frisbee, and more. Our platform is continuously growing as new coaches join."
    },
    {
      question: "How do I schedule sessions with a coach?",
      answer: "After viewing a coach's profile and availability, you can connect with them directly through the platform. Coaches display their weekly availability, and you can coordinate session times via email or phone based on mutual availability."
    },
    {
      question: "Can I train with multiple coaches?",
      answer: "Absolutely! Many students work with different coaches for different sports or to get diverse perspectives on their training. You can connect with as many coaches as you'd like through the platform."
    },
    {
      question: "What if I need to cancel a session?",
      answer: "Cancellation policies vary by coach. We recommend discussing cancellation terms directly with your coach when you first connect. Most coaches appreciate at least 24-48 hours notice for cancellations."
    },
    {
      question: "Are coaches verified?",
      answer: "Yes, all coaches on our platform are verified UMD community members or local professionals with documented coaching experience. We review credentials, certifications, and background before approving coach profiles."
    }
  ];

  return (
    <>
    <div className="min-h-screen p-4 py-8" style={{ fontFamily: 'Apple Chancery, cursive' }}>
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="bg-white/80 hover:bg-white border-2 border-gray-300"
            style={{ cursor: 'pointer' }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Title */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-black text-gray-900" style={{ fontFamily: 'Apple Chancery, cursive' }}>
            About Coach Connect
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Empowering UMD students to reach their athletic potential through personalized coaching
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border-2 border-gray-200 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-8 h-8 text-red-600" />
            <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Coach Connect bridges the gap between ambitious UMD students and expert coaches in the club sports community.
            We believe every student athlete deserves access to quality coaching, regardless of their sport or skill level.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Our platform makes it easy to find, connect with, and learn from experienced coaches who are passionate about
            helping students improve their skills, build confidence, and achieve their athletic goals.
          </p>
        </div>

        {/* How It Works */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border-2 border-gray-200 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-8 h-8 text-red-600" />
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900">Create Your Profile</h3>
              <p className="text-gray-700">
                Sign up as a student or coach and tell us about your sports interests and experience.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900">Find Your Match</h3>
              <p className="text-gray-700">
                Browse coaches matched to your sports, view their profiles, rates, and availability.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900">Start Training</h3>
              <p className="text-gray-700">
                Connect with coaches, schedule sessions, and begin your journey to athletic excellence.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border-2 border-gray-200 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-8 h-8 text-red-600" />
            <h2 className="text-3xl font-bold text-gray-900">Our Values</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900">Accessibility</h3>
              <p className="text-gray-700">
                Quality coaching should be accessible to all students, regardless of background or experience level.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900">Excellence</h3>
              <p className="text-gray-700">
                We connect students with top-tier coaches who are committed to developing athletic talent.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900">Community</h3>
              <p className="text-gray-700">
                Building a supportive network of athletes and coaches within the UMD community.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900">Growth</h3>
              <p className="text-gray-700">
                Fostering continuous improvement and personal development through dedicated coaching.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border-2 border-gray-200 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="w-8 h-8 text-red-600" />
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 last:border-b-0">
                <button
                  className="w-full text-left py-4 flex items-center justify-between hover:text-red-600 transition-colors"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="text-lg font-semibold text-gray-900">{faq.question}</span>
                  <span className="text-2xl text-red-600 flex-shrink-0 ml-4">
                    {openFaq === index ? '−' : '+'}
                  </span>
                </button>
                {openFaq === index && (
                  <div className="pb-4 pr-12">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-6 py-8">
          <h2 className="text-4xl font-bold text-gray-900">Ready to Get Started?</h2>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => navigate("/student/onboarding")}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg rounded-3xl"
              style={{ cursor: 'pointer' }}
            >
              Find a Coach
            </Button>
            <Button
              onClick={() => navigate("/coach/onboarding")}
              variant="outline"
              className="bg-white hover:bg-gray-50 border-2 border-gray-300 px-8 py-6 text-lg rounded-3xl"
              style={{ cursor: 'pointer' }}
            >
              Become a Coach
            </Button>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}