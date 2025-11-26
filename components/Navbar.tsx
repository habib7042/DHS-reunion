
import React, { useState } from 'react';
import { Menu, X, Home, Calendar, Search, BookOpen, Languages } from 'lucide-react';
import { AppView } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface NavbarProps {
  onNavigate: (view: AppView) => void;
  currentView: AppView;
  logo: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView, logo }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, language, toggleLanguage } = useLanguage();

  const handleNav = (view: AppView) => {
    onNavigate(view);
    setIsMenuOpen(false);
  };

  const isActive = (view: AppView) => currentView === view ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-800 hover:text-white';

  return (
    <nav className="bg-school-primary text-white shadow-lg no-print sticky top-0 z-50 font-sans">
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
              <span className="font-serif text-xl font-bold block leading-none tracking-tight">{t('school_name')}</span>
              <span className="text-[10px] text-blue-200 tracking-[0.1em] uppercase font-medium">{t('reunion_title_short')}</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <button 
                onClick={() => handleNav('home')} 
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center ${isActive('home')}`}
              >
                <Home className="w-4 h-4 mr-2" /> {t('nav_home')}
              </button>
              <button 
                onClick={() => handleNav('about')} 
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center ${isActive('about')}`}
              >
                <BookOpen className="w-4 h-4 mr-2" /> {t('nav_history')}
              </button>
              <button 
                onClick={() => handleNav('schedule')} 
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center ${isActive('schedule')}`}
              >
                <Calendar className="w-4 h-4 mr-2" /> {t('nav_schedule')}
              </button>
              <button 
                onClick={() => handleNav('check-status')} 
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center ${isActive('check-status')}`}
              >
                <Search className="w-4 h-4 mr-2" /> {t('nav_download')}
              </button>
              <button 
                onClick={() => handleNav('register')} 
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 ${currentView === 'register' ? 'bg-school-accent text-school-primary shadow-lg' : 'bg-white/10 hover:bg-white/20 text-white'}`}
              >
                {t('nav_register')}
              </button>
              
              {/* Language Toggle */}
              <button 
                onClick={toggleLanguage}
                className="ml-2 px-3 py-1 rounded-full bg-blue-800 hover:bg-blue-700 text-xs font-bold border border-blue-600 flex items-center transition-all"
              >
                <Languages className="w-3 h-3 mr-1" />
                {language === 'bn' ? 'ENGLISH' : 'বাংলা'}
              </button>
            </div>
          </div>

          {/* Mobile Menu Button & Language */}
          <div className="-mr-2 flex md:hidden items-center">
            <button 
              onClick={toggleLanguage}
              className="px-2 py-1 mr-2 rounded bg-blue-800 text-xs font-bold"
            >
              {language === 'bn' ? 'EN' : 'BN'}
            </button>
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
              {t('nav_home')}
            </button>
            <button 
              onClick={() => handleNav('about')}
              className={`block w-full text-left px-3 py-3 rounded-md text-base font-medium ${currentView === 'about' ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-800 hover:text-white'}`}
            >
              {t('nav_history')}
            </button>
            <button 
              onClick={() => handleNav('schedule')}
              className={`block w-full text-left px-3 py-3 rounded-md text-base font-medium ${currentView === 'schedule' ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-800 hover:text-white'}`}
            >
              {t('nav_schedule')}
            </button>
            <button 
              onClick={() => handleNav('check-status')}
              className={`block w-full text-left px-3 py-3 rounded-md text-base font-medium ${currentView === 'check-status' ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-800 hover:text-white'}`}
            >
              {t('nav_download')}
            </button>
            <button 
              onClick={() => handleNav('register')}
              className={`block w-full text-left px-3 py-3 rounded-md text-base font-medium ${currentView === 'register' ? 'bg-school-accent text-school-primary' : 'text-blue-100 hover:bg-blue-800 hover:text-white'}`}
            >
              {t('nav_register')}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
