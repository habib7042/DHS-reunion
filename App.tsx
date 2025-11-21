
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { RegistrationForm } from './components/RegistrationForm';
import { TicketBooking } from './components/TicketBooking';
import { IDCardGenerator } from './components/IDCardGenerator';
import { EventSchedule } from './components/EventSchedule';
import { PaymentGateway } from './components/PaymentGateway';
import { AdminDashboard } from './components/AdminDashboard';
import { StatusCheck } from './components/StatusCheck';
import { AboutUs } from './components/AboutUs';
import { AiAssistant } from './components/AiAssistant';
import { InstallPWA } from './components/InstallPWA';
import { AppView, StudentData, TicketData, PaymentDetails, Registration } from './types';
import { Calendar, ArrowRight, Users, Clock, CheckCircle, Lock, Timer, PartyPopper, Utensils, Mic2 } from 'lucide-react';
import { registrationService } from './services/api';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  
  // State for Registrations
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Countdown Logic
  const REGISTRATION_START_DATE = new Date('2025-12-01T00:00:00');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = REGISTRATION_START_DATE.getTime() - now.getTime();

      if (difference <= 0) {
        setIsRegistrationOpen(true);
        clearInterval(timer);
      } else {
        setIsRegistrationOpen(false);
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  
  // Custom "97" Logo - Base64 SVG
  const NEW_LOGO_SVG = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImcxIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMWUzYThhIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMGYxNzJhIi8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9ImcyIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjZmJiZjI0Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZDk3NzA2Ii8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PGNpcmNsZSBjeD0iMjU2IiBjeT0iMjU2IiByPSIyNDUiIGZpbGw9InVybCgjZzEpIiBzdHJva2U9InVybCgjZzIpIiBzdHJva2Utd2lkdGg9IjEwIi8+PHRleHQgeD0iMjU2IiB5PSIzNDAiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZvbnQtc2l6ZT0iMjQwIiBmaWxsPSJ1cmwoI2cyKSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgc3R5bGU9ImZpbHRlcjpkcm9wLXNoYWRvdyg0cHggNHB4IDAgcmdiYSgwLDAsMCwwLjUpKSI+OTc8L3RleHQ+PHBhdGggaWQ9ImMiIGQ9Ik0xNDAsMzgwIFEyNTYsNDUwIDM3MiwzODAiIGZpbGw9Im5vbmUiLz48dGV4dCBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZvbnQtc2l6ZT0iMzUiIGZpbGw9IndoaXRlIiBsZXR0ZXItc3BhY2luZz0iNSI+PHRleHRQYXRoIGhyZWY9IiNjIiBzdGFydE9mZnNldD0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5SRVVOSU9OPC90ZXh0UGF0aD48L3RleHQ+PHRleHQgeD0iMjU2IiB5PSIxMTAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjMwIiBmaWxsPSIjOTNjNWZkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBsZXR0ZXItc3BhY2luZz0iMiI+RVNULiAxOTI5PC90ZXh0Pjwvc3ZnPg==';

  // Assets with LocalStorage persistence
  const [schoolLogo, setSchoolLogo] = useState<string>(() => {
    const stored = localStorage.getItem('dhs_school_logo_97');
    // Force update if it's missing
    if (!stored) {
      return NEW_LOGO_SVG;
    }
    return stored;
  });

  useEffect(() => {
    localStorage.setItem('dhs_school_logo_97', schoolLogo);
  }, [schoolLogo]);

  // Fetch data when view changes to Admin
  useEffect(() => {
    if (view === 'admin-dashboard' || view === 'check-status') {
      loadRegistrations();
    }
  }, [view]);

  const loadRegistrations = async () => {
    setIsLoading(true);
    const data = await registrationService.getAll();
    setRegistrations(data);
    setIsLoading(false);
  };

  const handleRegistrationSubmit = (data: StudentData) => {
    setStudentData(data);
    setView('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTicketSelect = (data: TicketData) => {
    setTicketData(data);
    setView('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaymentConfirm = async (paymentDetails: PaymentDetails) => {
    if (!studentData || !ticketData) return;

    const newRegistration: Registration = {
      id: `REG-${Date.now()}`,
      student: studentData,
      ticket: ticketData,
      payment: paymentDetails,
      status: 'pending',
      submissionDate: new Date().toISOString()
    };

    await registrationService.create(newRegistration);
    setRegistrations(prev => [...prev, newRegistration]);
    
    setView('pending-success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminApprove = async (id: string) => {
    const updated = await registrationService.updateStatus(id, 'approved');
    if (updated) {
      setRegistrations(prev => prev.map(r => r.id === id ? updated : r));
    }
  };

  const handleAdminReject = async (id: string) => {
    const updated = await registrationService.updateStatus(id, 'rejected');
    if (updated) {
      setRegistrations(prev => prev.map(r => r.id === id ? updated : r));
    }
  };

  const handleFoundRegistration = (reg: Registration) => {
    setStudentData(reg.student);
    setTicketData(reg.ticket);
    setView('id-card');
  };

  const navigate = (targetView: AppView) => {
    if (targetView === 'register' && !isRegistrationOpen) {
      alert("Registration opens on December 01, 2025!");
      return;
    }

    setView(targetView);
    if (targetView === 'home' || targetView === 'check-status') {
      setStudentData(null);
      setTicketData(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-slate-50 selection:bg-school-accent selection:text-school-primary">
      <Navbar onNavigate={navigate} currentView={view} logo={schoolLogo} />

      <main className="flex-grow">
        {view === 'home' && (
          <div className="relative overflow-hidden group">
            {/* Premium Hero Background */}
            <div className="absolute inset-0 z-0 bg-[#0a192f]">
               {/* Grid Pattern */}
               <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
               {/* Glow Effects */}
               <div className="absolute top-0 left-1/2 w-[800px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] transform -translate-x-1/2 -translate-y-1/2"></div>
               <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-amber-500/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 pt-32 pb-28 sm:px-6 lg:px-8 flex flex-col items-center text-center">
              {/* Floating Badge */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 text-amber-400 font-bold text-xs px-5 py-2 rounded-full mb-8 uppercase tracking-[0.2em] shadow-lg animate-fade-in-down">
                2 Days after Eid-ul-Fitr, 2026
              </div>
              
              <h1 className="text-6xl md:text-8xl font-serif font-bold text-white mb-6 leading-none tracking-tight drop-shadow-2xl animate-fade-in">
                97 Years of <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-100 to-amber-300">Excellence</span>
              </h1>
              
              <p className="mt-6 max-w-2xl text-xl text-blue-100/80 mb-12 leading-relaxed font-light animate-fade-in-up">
                Dighali High School Alumni Reunion (Est. 1929). <br/> A timeless celebration of friendship, heritage, and future.
              </p>
              
              {!isRegistrationOpen ? (
                <div className="mb-12 w-full max-w-4xl animate-fade-in-up">
                  {/* Glass Card for Timer */}
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden group/timer">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover/timer:translate-x-[100%] transition-transform duration-1000"></div>
                    
                    <div className="flex items-center justify-center gap-2 text-amber-400 mb-6 font-bold uppercase tracking-widest text-sm">
                      <Timer className="w-5 h-5" /> Registration Countdown
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 md:gap-8">
                       {Object.entries(timeLeft).map(([unit, value]) => (
                         <div key={unit} className="flex flex-col items-center">
                           <div className="text-4xl md:text-6xl font-bold text-white tabular-nums tracking-tight text-shadow-glow">{String(value).padStart(2, '0')}</div>
                           <div className="text-[10px] md:text-xs text-blue-300 uppercase tracking-[0.2em] mt-2 opacity-70">{unit}</div>
                         </div>
                       ))}
                    </div>
                    <div className="mt-8 pt-6 border-t border-white/10">
                       <p className="text-blue-200 text-sm">Mark your calendar: <span className="text-white font-bold">December 01, 2025</span></p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto animate-fade-in-up">
                  <button 
                    onClick={() => navigate('register')}
                    className="group relative px-10 py-4 bg-amber-400 hover:bg-amber-300 text-school-primary font-bold rounded-full shadow-[0_0_30px_rgba(251,191,36,0.3)] hover:shadow-[0_0_50px_rgba(251,191,36,0.5)] transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">Register Now <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  </button>
                  <button 
                    onClick={() => navigate('check-status')}
                    className="px-10 py-4 bg-white/5 border border-white/20 backdrop-blur-sm text-white hover:bg-white/10 font-bold rounded-full transition-all duration-300 hover:shadow-lg"
                  >
                    Download Entry Card
                  </button>
                </div>
              )}

              {/* Floating Stats Bar */}
              <div className="absolute -bottom-16 left-4 right-4 md:left-auto md:right-auto md:w-full md:max-w-5xl z-20">
                <div className="bg-white shadow-2xl rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-around items-center gap-8 md:gap-0 border-b-4 border-school-accent">
                  <div className="text-center group cursor-default">
                     <div className="flex justify-center mb-2">
                       <Clock className="w-6 h-6 text-slate-300 group-hover:text-school-primary transition-colors" />
                     </div>
                     <div className="text-3xl font-bold text-slate-800 font-serif">1929</div>
                     <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Established</p>
                  </div>
                  <div className="hidden md:block w-px h-12 bg-slate-100"></div>
                  <div className="text-center group cursor-default">
                     <div className="flex justify-center mb-2">
                       <Users className="w-6 h-6 text-slate-300 group-hover:text-school-secondary transition-colors" />
                     </div>
                     <div className="text-3xl font-bold text-slate-800 font-serif">600+</div>
                     <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Alumni</p>
                  </div>
                  <div className="hidden md:block w-px h-12 bg-slate-100"></div>
                  <div className="text-center group cursor-default">
                     <div className="flex justify-center mb-2">
                       <Calendar className="w-6 h-6 text-slate-300 group-hover:text-school-primary transition-colors" />
                     </div>
                     <div className="text-3xl font-bold text-slate-800 font-serif">97th</div>
                     <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Anniversary</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'home' && (
           <div className="pt-28 pb-20 bg-slate-50">
              <div className="max-w-6xl mx-auto px-4">
                 <div className="text-center mb-16">
                    <span className="text-school-secondary text-xs font-bold uppercase tracking-widest block mb-2">Why Attend?</span>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-800">Event Highlights</h2>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-slate-100 group">
                       <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                          <PartyPopper className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
                       </div>
                       <h3 className="text-xl font-bold text-slate-800 mb-3">Grand Reunion</h3>
                       <p className="text-slate-600 leading-relaxed">Reconnect with old friends, mentors, and batchmates. Relive the golden days of your school life.</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-slate-100 group">
                       <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors duration-300">
                          <Utensils className="w-7 h-7 text-amber-600 group-hover:text-white transition-colors" />
                       </div>
                       <h3 className="text-xl font-bold text-slate-800 mb-3">Royal Feast</h3>
                       <p className="text-slate-600 leading-relaxed">Enjoy a premium dining experience with traditional delicacies, snacks, and refreshments all day long.</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-slate-100 group">
                       <div className="w-14 h-14 bg-pink-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-pink-500 transition-colors duration-300">
                          <Mic2 className="w-7 h-7 text-pink-600 group-hover:text-white transition-colors" />
                       </div>
                       <h3 className="text-xl font-bold text-slate-800 mb-3">Cultural Night</h3>
                       <p className="text-slate-600 leading-relaxed">A mesmerizing evening of music, drama, and performances by alumni and guest artists.</p>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {view === 'about' && (
          <AboutUs />
        )}

        {view === 'schedule' && (
          <EventSchedule />
        )}

        {view === 'register' && (
          <div className="bg-slate-50 py-10 px-4 animate-fade-in">
            <div className="max-w-3xl mx-auto text-center mb-8">
               <h2 className="text-3xl md:text-4xl font-serif font-bold text-school-primary mb-3">Alumni Registration</h2>
               <p className="text-slate-600 text-lg">Please provide your details to get your digital ID card.</p>
            </div>
            <RegistrationForm onSubmit={handleRegistrationSubmit} />
          </div>
        )}

        {view === 'booking' && studentData && (
           <div className="bg-slate-50 py-10 px-4 animate-fade-in">
            <div className="max-w-3xl mx-auto text-center mb-8">
               <h2 className="text-3xl md:text-4xl font-serif font-bold text-school-primary mb-3">Select Your Pass</h2>
               <p className="text-slate-600 text-lg">Choose a package that suits your attendance plan.</p>
            </div>
            <TicketBooking onSelect={handleTicketSelect} />
          </div>
        )}

        {view === 'payment' && ticketData && (
          <div className="bg-slate-50 py-10 px-4">
            <div className="max-w-3xl mx-auto text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-school-primary mb-3">Complete Payment</h2>
              <p className="text-slate-600 text-lg">Finalize your registration to submit for verification.</p>
            </div>
            <PaymentGateway 
              ticket={ticketData} 
              onConfirm={handlePaymentConfirm} 
              onBack={() => setView('booking')}
            />
          </div>
        )}

        {view === 'pending-success' && (
          <div className="min-h-[60vh] flex items-center justify-center px-4 animate-fade-in">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl text-center max-w-xl border border-slate-100">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-school-primary mb-4">Registration Submitted!</h2>
              <p className="text-slate-600 mb-8 text-lg">
                Thank you for registering. Your payment is currently under review by the admin team. 
                Once approved, you will be able to download your ID card.
              </p>
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('home')}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-6 rounded-xl transition-colors"
                >
                  Back to Home
                </button>
                <button 
                  onClick={() => navigate('check-status')}
                  className="w-full bg-school-primary hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                >
                  Download Card Later
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'check-status' && (
          <StatusCheck onFound={handleFoundRegistration} />
        )}

        {view === 'id-card' && studentData && ticketData && (
          <IDCardGenerator 
            student={studentData} 
            ticket={ticketData} 
            logo={schoolLogo}
          />
        )}

        {(view === 'admin-login' || view === 'admin-dashboard') && (
          <AdminDashboard 
            registrations={registrations}
            onApprove={handleAdminApprove}
            onReject={handleAdminReject}
            onLogin={() => {
              setIsAdminAuthenticated(true);
              setView('admin-dashboard');
            }}
            isAuthenticated={isAdminAuthenticated}
          />
        )}
      </main>
      
      <InstallPWA />
      <AiAssistant />
      
      <footer className="bg-[#0a192f] text-slate-400 py-16 mt-auto no-print border-t border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className="mb-8 flex justify-center">
             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden p-1 shadow-lg shadow-blue-900/50">
               <img src={schoolLogo} alt="DHS Logo" className="w-full h-full object-contain" />
             </div>
          </div>
          <h3 className="text-white font-serif text-2xl mb-3 tracking-wide">Dighali High School Reunion 2026</h3>
          <p className="max-w-md mx-auto text-sm mb-10 text-slate-400 font-light leading-relaxed">
             Celebrating 97 years of academic excellence and lifelong friendships. <br/> Established in 1929.
          </p>
          
          <div className="flex justify-center gap-6 mb-10">
             <a href="#" className="text-slate-400 hover:text-white transition-colors">Facebook</a>
             <a href="#" className="text-slate-400 hover:text-white transition-colors">Event Page</a>
             <a href="#" className="text-slate-400 hover:text-white transition-colors">Contact</a>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs tracking-wide text-slate-500">
             <p>&copy; 2026 Reunion Committee. All rights reserved.</p>
             <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <button onClick={() => navigate('admin-login')} className="flex items-center hover:text-white transition-colors">
                  <Lock className="w-3 h-3 mr-1" /> Admin Access
                </button>
                <p className="flex items-center">
                  Designed & Built by <a href="https://m.me/habib.ahsan0" target="_blank" rel="noopener noreferrer" className="ml-1 text-amber-400 hover:text-amber-300 transition-colors font-bold">Habib</a>
                </p>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
