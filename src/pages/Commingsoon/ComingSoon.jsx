import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Mail, Bell, ArrowRight, Zap, ChevronRight, Users, Briefcase, Award } from 'lucide-react';

const ComingSoon = () => {
  const [email, setEmail] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setEmail('');
    }
  };

  // Countdown timer state
  const [timeLeft, setTimeLeft] = React.useState({
    days: 15,
    hours: 23,
    minutes: 45,
    seconds: 12
  });

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    { icon: Briefcase, title: "Latest Govt Jobs", description: "Real-time updates from all sectors" },
    { icon: Users, title: "Community Support", description: "Connect with fellow aspirants" },
    { icon: Award, title: "Expert Guidance", description: "Tips from successful candidates" }
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      
      {/* Animated Background Elements */}
      {/* <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-200/30 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-100/20 rounded-full blur-3xl" />
      </div> */}

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen flex flex-col">
        
       

        {/* Hero Section */}
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
          {/* Coming Soon Badge */}
         

          {/* <h1 className="text-5xl mb-3 sm:text-7xl lg:text-5xl font-black mb-6 bg-gradient-to-r from-orange-600 via-orange-500 to-green-600 bg-clip-text text-transparent">
            Something Amazing
          </h1> */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-800 mb-8 mt-10">
         <span className="text-orange-500 underline decoration-green-400 decoration-4">Coming Soon</span>
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mb-3 leading-relaxed">
            We're crafting a revolutionary platform to help you find the perfect government job. 
            Stay tuned for the biggest launch in career guidance!
          </p>

          {/* Countdown Timer */}
          


          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 w-full mt-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-orange-100 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>

        
        </div>

      </div>
    </div>
  );
};

export default ComingSoon;