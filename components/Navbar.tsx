import React, { useState } from 'react';
import { Menu, X, Home, Calendar, Search, UserCheck } from 'lucide-react';
import { AppView } from '../types';

interface NavbarProps {
  onNavigate: (view: AppView) => void;
  currentView: AppView;
  logo: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView, logo }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNav = (view: AppView) => {
    onNavigate(view);
    setIsMenuOpen(false);
  };

  const isActive = (view: AppView) => currentView === view ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-800 hover:text-white';

  return (
    <nav className="bg-school-primary text-white shadow-lg no-print sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer group" onClick={() => handleNav('home')}>
            <div className="relative">
              <img 
                src={logo} 
                alt="School Logo" 
                className="h-10 w-10 object-contain mr-3 bg-white rounded-full p-0.5 border-2 border-school-accent transition-transform group-hover:-rotate-12" 
              />
            </div>
            <div>
              <span className="font-serif text-xl font-bold block leading-none tracking-tight">Dighali High School</span>
              <span className="text-[10px] text-blue-200 tracking-[0.2em] uppercase font-medium">Reunion 2026</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <button 
                onClick={() => handleNav('home')} 
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center ${isActive('home')}`}
              >
                <Home className="w-4 h-4 mr-2" /> Home
              </button>
              <button 
                onClick={() => handleNav('schedule')} 
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center ${isActive('schedule')}`}
              >
                <Calendar className="w-4 h-4 mr-2" /> Schedule
              </button>
              <button 
                onClick={() => handleNav('check-status')} 
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center ${isActive('check-status')}`}
              >
                <Search className="w-4 h-4 mr-2" /> Download Card
              </button>
              <button 
                onClick={() => handleNav('register')} 
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 ${currentView === 'register' ? 'bg-school-accent text-school-primary shadow-lg' : 'bg-white/10 hover:bg-white/20 text-white'}`}
              >
                Register Now
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-800 focus:outline-none transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-900 border-t border-blue-800 absolute w-full shadow-xl animate-fade-in-down">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button 
              onClick={() => handleNav('home')}
              className={`block w-full text-left px-3 py-3 rounded-md text-base font-medium ${currentView === 'home' ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-800 hover:text-white'}`}
            >
              Home
            </button>
            <button 
              onClick={() => handleNav('schedule')}
              className={`block w-full text-left px-3 py-3 rounded-md text-base font-medium ${currentView === 'schedule' ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-800 hover:text-white'}`}
            >
              Event Schedule
            </button>
            <button 
              onClick={() => handleNav('check-status')}
              className={`block w-full text-left px-3 py-3 rounded-md text-base font-medium ${currentView === 'check-status' ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-800 hover:text-white'}`}
            >
              Download Entry Card
            </button>
            <button 
              onClick={() => handleNav('register')}
              className={`block w-full text-left px-3 py-3 rounded-md text-base font-medium ${currentView === 'register' ? 'bg-school-accent text-school-primary' : 'text-blue-100 hover:bg-blue-800 hover:text-white'}`}
            >
              Register Now
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};