
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
import { LiveChat } from './components/LiveChat';
import { AppView, StudentData, TicketData, PaymentDetails, Registration } from './types';
import { Calendar, ArrowRight, Users, Clock, CheckCircle, Lock, Timer, Download, Award, X, Bell } from 'lucide-react';
import { registrationService } from './services/api';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentDetails | null>(null);
  
  // State for Registrations
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Countdown Logic
  const REGISTRATION_START_DATE = new Date('2025-12-01T00:00:00');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  // Modal State
  const [showLockedModal, setShowLockedModal] = useState(false);

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
    setPaymentData(reg.payment); // Capture payment data
    setView('id-card');
  };

  const navigate = (targetView: AppView) => {
    // Intercept register click if registration is not open
    if (targetView === 'register' && !isRegistrationOpen) {
      setShowLockedModal(true);
      return;
    }

    setView(targetView);
    if (targetView === 'home' || targetView === 'check-status') {
      setStudentData(null);
      setTicketData(null);
      setPaymentData(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-slate-50 selection:bg-school-accent selection:text-school-primary">
      <Navbar onNavigate={navigate} currentView={view} logo={schoolLogo} />

      {/* Registration Locked Pop-up Modal */}
      {showLockedModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center relative overflow-hidden border-2 border-school-accent/20">
             {/* Background Effect */}
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-school-primary via-school-accent to-school-primary"></div>
             
             <button 
               onClick={() => setShowLockedModal(false)}
               className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
             >
               <X className="w-5 h-5 text-slate-500" />
             </button>

             <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
               <Lock className="w-10 h-10 text-school-primary" />
             </div>

             <h3 className="text-2xl font-serif font-bold text-school-primary mb-2">Registration Locked</h3>
             <p className="text-slate-600 mb-6 leading-relaxed">
               Online registration for the 97th Reunion is not available yet. Please wait for the official opening date.
             </p>

             <div className="bg-blue-50 rounded-xl p-4 mb-8 border border-blue-100">
               <p className="text-xs text-blue-600 font-bold uppercase tracking-widest mb-1">Opens On</p>
               <div className="flex items-center justify-center text-lg font-bold text-school-primary">
                 <Calendar className="w-5 h-5 mr-2 text-school-accent" />
                 December 01, 2025
               </div>
             </div>

             <button 
               onClick={() => setShowLockedModal(false)}
               className="w-full py-3.5 bg-school-primary text-white font-bold rounded-xl hover:bg-blue-800 transition-all shadow-lg flex items-center justify-center gap-2"
             >
               <Bell className="w-4 h-4" /> Got it, I'll come back
             </button>
          </div>
        </div>
      )}

      <main className="flex-grow">
        {view === 'home' && (
          <>
            {/* 1. HEADER SECTION */}
            <div className="relative bg-[#0a192f] text-white pt-24 pb-20 overflow-hidden">
               {/* Background Effects */}
               <div className="absolute inset-0 z-0">
                 <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
                 <div className="absolute top-0 left-1/2 w-[800px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] transform -translate-x-1/2 -translate-y-1/2"></div>
               </div>

               <div className="relative z-10 container mx-auto px-4 text-center">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-1.5 rounded-full text-amber-400 font-bold text-xs uppercase tracking-[0.2em] mb-8 animate-fade-in-down border border-white/10">
                     <Calendar className="w-3 h-3" /> 2 Days after Eid-ul-Fitr, 2026
                  </div>
                  
                  <h1 className="text-5xl md:text-8xl font-serif font-bold mb-6 leading-none tracking-tight drop-shadow-2xl animate-fade-in">
                    97 Years of <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-100 to-amber-300">Excellence</span>
                  </h1>

                  <p className="max-w-2xl mx-auto text-lg text-blue-100/80 mb-10 leading-relaxed font-light animate-fade-in-up">
                    Dighali High School Alumni Reunion (Est. 1929). <br/>
                    A timeless celebration of heritage, friendship, and the future.
                  </p>

                  {isRegistrationOpen ? (
                    <button 
                      onClick={() => navigate('register')}
                      className="px-10 py-4 bg-amber-400 hover:bg-amber-300 text-school-primary font-bold rounded-full shadow-[0_0_30px_rgba(251,191,36,0.3)] hover:shadow-[0_0_50px_rgba(251,191,36,0.5)] transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up flex items-center mx-auto"
                    >
                      Register Now <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                  ) : (
                    <button 
                      onClick={() => setShowLockedModal(true)}
                      className="px-10 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full border border-white/20 transition-all duration-300 animate-fade-in-up flex items-center mx-auto backdrop-blur-sm"
                    >
                      <Lock className="w-4 h-4 mr-2" /> Registration Locked
                    </button>
                  )}
               </div>
            </div>

            {/* 2. REGISTRATION COUNTDOWN */}
            {!isRegistrationOpen && (
              <div className="bg-school-primary relative z-20">
                <div className="container mx-auto px-4 py-12">
                  <div className="bg-blue-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
                     {/* Background glow */}
                     <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]"></div>

                     <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="text-center md:text-left">
                           <h2 className="text-amber-400 font-bold uppercase tracking-widest text-sm mb-2 flex items-center justify-center md:justify-start">
                              <Timer className="w-4 h-4 mr-2" /> Registration Countdown
                           </h2>
                           <p className="text-white text-2xl md:text-3xl font-serif font-bold">
                              Mark your calendar: <br/>
                              <span className="text-blue-200">December 01, 2025</span>
                           </p>
                        </div>

                        <div className="flex gap-4 md:gap-8">
                           {Object.entries(timeLeft).map(([unit, value]) => (
                             <div key={unit} className="flex flex-col items-center bg-black/20 rounded-lg p-3 min-w-[70px] md:min-w-[90px] border border-white/5">
                               <div className="text-3xl md:text-4xl font-bold text-white tabular-nums text-shadow-glow">{String(value).padStart(2, '0')}</div>
                               <div className="text-[10px] text-blue-300 uppercase tracking-[0.2em] mt-1 opacity-80">{unit}</div>
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. ALREADY REGISTERED */}
            <div className="bg-white py-20 border-b border-slate-100">
               <div className="container mx-auto px-4 text-center">
                  <div className="w-16 h-16 bg-blue-50 text-school-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                     <CheckCircle className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-800 mb-4">Already Registered?</h2>
                  <p className="text-slate-600 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
                     If you have already completed your registration and payment, you can check your approval status and download your digital entry badge here.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                     <button 
                       onClick={() => navigate('check-status')}
                       className="px-8 py-3 bg-white border-2 border-school-primary text-school-primary font-bold rounded-full hover:bg-school-primary hover:text-white transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-md"
                     >
                       <Download className="w-5 h-5 mr-2" /> Download Entry Card
                     </button>
                     
                     <button 
                       onClick={() => navigate('schedule')}
                       className="px-8 py-3 bg-slate-100 text-slate-700 font-bold rounded-full hover:bg-slate-200 transition-all duration-300 flex items-center justify-center"
                     >
                       <Calendar className="w-5 h-5 mr-2" /> View Schedule
                     </button>
                  </div>
               </div>
            </div>

            {/* 4. ESTABLISHED SECTION */}
            <div className="bg-slate-50 py-24">
               <div className="container mx-auto px-4">
                  <div className="text-center mb-16">
                     <span className="text-school-secondary font-bold tracking-widest uppercase text-xs mb-2 block">Since 1929</span>
                     <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-800">Our Legacy</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                     {/* Card 1 */}
                     <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-school-primary text-center hover:-translate-y-1 transition-transform duration-300">
                        <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                           <Clock className="w-7 h-7 text-school-primary" />
                        </div>
                        <div className="text-5xl font-bold text-slate-800 font-serif mb-2">1929</div>
                        <p className="text-slate-500 font-medium uppercase tracking-widest text-sm">Established</p>
                     </div>

                     {/* Card 2 */}
                     <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-school-accent text-center hover:-translate-y-1 transition-transform duration-300 md:-mt-6">
                        <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                           <Users className="w-7 h-7 text-school-secondary" />
                        </div>
                        <div className="text-5xl font-bold text-slate-800 font-serif mb-2">600+</div>
                        <p className="text-slate-500 font-medium uppercase tracking-widest text-sm">Alumni Expected</p>
                     </div>

                     {/* Card 3 */}
                     <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-school-primary text-center hover:-translate-y-1 transition-transform duration-300">
                        <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                           <Award className="w-7 h-7 text-school-primary" />
                        </div>
                        <div className="text-5xl font-bold text-slate-800 font-serif mb-2">97th</div>
                        <p className="text-slate-500 font-medium uppercase tracking-widest text-sm">Anniversary</p>
                     </div>
                  </div>
               </div>
            </div>
          </>
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
            payment={paymentData}
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
      <LiveChat />
      
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
