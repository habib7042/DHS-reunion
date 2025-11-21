
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
import { Calendar, ArrowRight, Users, Clock, CheckCircle, Lock } from 'lucide-react';
import { registrationService } from './services/api';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  
  // State for Registrations
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Custom "97" Logo - Base64 SVG
  const NEW_LOGO_SVG = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImcxIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMWUzYThhIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMGYxNzJhIi8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9ImcyIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjZmJiZjI0Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZDk3NzA2Ii8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PGNpcmNsZSBjeD0iMjU2IiBjeT0iMjU2IiByPSIyNDUiIGZpbGw9InVybCgjZzEpIiBzdHJva2U9InVybCgjZzIpIiBzdHJva2Utd2lkdGg9IjEwIi8+PHRleHQgeD0iMjU2IiB5PSIzNDAiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZvbnQtc2l6ZT0iMjQwIiBmaWxsPSJ1cmwoI2cyKSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgc3R5bGU9ImZpbHRlcjpkcm9wLXNoYWRvdyg0cHggNHB4IDAgcmdiYSgwLDAsMCwwLjUpKSI+OTc8L3RleHQ+PHBhdGggaWQ9ImMiIGQ9Ik0xNDAsMzgwIFEyNTYsNDUwIDM3MiwzODAiIGZpbGw9Im5vbmUiLz48dGV4dCBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZvbnQtc2l6ZT0iMzUiIGZpbGw9IndoaXRlIiBsZXR0ZXItc3BhY2luZz0iNSI+PHRleHRQYXRoIGhyZWY9IiNjIiBzdGFydE9mZnNldD0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5SRVVOSU9OPC90ZXh0UGF0aD48L3RleHQ+PHRleHQgeD0iMjU2IiB5PSIxMTAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjMwIiBmaWxsPSIjOTNjNWZkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBsZXR0ZXItc3BhY2luZz0iMiI+RVNULiAxOTI5PC90ZXh0Pjwvc3ZnPg==';

  // Assets with LocalStorage persistence - Key updated to force refresh for 97 version
  const [schoolLogo, setSchoolLogo] = useState<string>(() => {
    const stored = localStorage.getItem('dhs_school_logo_97');
    // Force update if it's missing
    if (!stored) {
      return NEW_LOGO_SVG;
    }
    return stored;
  });

  // Save logo changes
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

    // Use Service
    await registrationService.create(newRegistration);
    
    // Update local state strictly for immediate UI feedback if needed, 
    // though usually we rely on the fetch next time.
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
    setView(targetView);
    if (targetView === 'home' || targetView === 'check-status') {
      setStudentData(null);
      setTicketData(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-slate-50">
      <Navbar onNavigate={navigate} currentView={view} logo={schoolLogo} />

      <main className="flex-grow">
        {view === 'home' && (
          <div className="relative overflow-hidden group">
            {/* Hero Background */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-school-primary via-blue-900 to-slate-900">
               <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px'}}></div>
               <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 pt-32 pb-20 sm:px-6 lg:px-8 flex flex-col items-center text-center">
              <div className="bg-school-accent/20 backdrop-blur-sm border border-school-accent/30 text-school-accent font-bold text-sm px-6 py-2 rounded-full mb-8 uppercase tracking-widest shadow-xl animate-pulse">
                2 Days after Eid-ul-Fitr, 2026 • Save the Date
              </div>
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-lg">
                97 Years of <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-school-accent to-amber-200">Heritage & Glory</span>
              </h1>
              <p className="mt-4 max-w-2xl text-xl text-blue-100 mb-12 leading-relaxed font-light">
                Calling all Dighali High School alumni (Est. 1929). Let's reunite to celebrate nearly a century of friendship, memories, and excellence.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
                <button 
                  onClick={() => navigate('register')}
                  className="group bg-school-accent text-school-primary hover:bg-white hover:text-school-primary font-bold py-4 px-10 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.6)] transform hover:-translate-y-1 flex items-center justify-center"
                >
                  Register Now <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => navigate('check-status')}
                  className="bg-transparent border-2 border-white/30 backdrop-blur-sm text-white hover:bg-white hover:text-school-primary font-bold py-4 px-10 rounded-full transition-all duration-300 flex items-center justify-center hover:shadow-lg"
                >
                  Download Entry Card
                </button>
              </div>
            </div>
            
            {/* Stats Section */}
            <div className="relative z-10 bg-white shadow-2xl mx-4 md:mx-auto max-w-6xl rounded-2xl -mt-10 p-8 border border-slate-100">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
                  <div className="p-4 group cursor-default">
                     <div className="flex justify-center mb-3">
                       <div className="p-3 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors">
                         <Clock className="w-6 h-6 text-school-primary" />
                       </div>
                     </div>
                     <div className="text-4xl font-bold text-slate-800 mb-1 font-serif">1929</div>
                     <p className="text-slate-500 text-sm uppercase tracking-wide font-medium">Established</p>
                  </div>
                  <div className="p-4 group cursor-default">
                     <div className="flex justify-center mb-3">
                       <div className="p-3 bg-amber-50 rounded-full group-hover:bg-amber-100 transition-colors">
                         <Users className="w-6 h-6 text-school-secondary" />
                       </div>
                     </div>
                     <div className="text-4xl font-bold text-slate-800 mb-1 font-serif">600+</div>
                     <p className="text-slate-500 text-sm uppercase tracking-wide font-medium">Alumni Expected</p>
                  </div>
                  <div className="p-4 group cursor-default">
                     <div className="flex justify-center mb-3">
                       <div className="p-3 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors">
                         <Calendar className="w-6 h-6 text-school-primary" />
                       </div>
                     </div>
                     <div className="text-4xl font-bold text-slate-800 mb-1 font-serif">97th</div>
                     <p className="text-slate-500 text-sm uppercase tracking-wide font-medium">Anniversary Edition</p>
                  </div>
               </div>
            </div>
            
            <div className="h-20 bg-slate-50"></div>
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
      
      {/* PWA Install Button */}
      <InstallPWA />

      {/* AI Assistant Floating Button */}
      <AiAssistant />
      
      <footer className="bg-slate-900 text-slate-400 py-12 mt-auto no-print border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="mb-6 flex justify-center">
             <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden p-1">
               <img src={schoolLogo} alt="DHS Logo" className="w-full h-full object-contain" />
             </div>
          </div>
          <h3 className="text-white font-serif text-xl mb-2">Dighali High School Reunion 2026</h3>
          <p className="max-w-md mx-auto text-sm mb-8">Celebrating 97 years of academic excellence and lifelong friendships. Established in 1929.</p>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
             <p>&copy; 2026 Reunion Committee. All rights reserved.</p>
             <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <button onClick={() => navigate('admin-login')} className="flex items-center hover:text-white transition-colors">
                  <Lock className="w-3 h-3 mr-1" /> Admin
                </button>
                <p className="flex items-center">
                  Made with <span className="text-red-500 mx-1">♥</span> by <a href="https://m.me/habib.ahsan0" target="_blank" rel="noopener noreferrer" className="ml-1 hover:text-white transition-colors underline decoration-dotted">Habib</a>
                </p>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
