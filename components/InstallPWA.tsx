
import React, { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const InstallPWA: React.FC = () => {
  const { t } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsStandalone(true);
    }
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallBtn(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallBtn(false);
  };

  if (isStandalone) return null;
  if (!showInstallBtn && !isIOS) return null;

  return (
    <>
      {showInstallBtn && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-auto z-50 animate-fade-in-up no-print font-sans">
          <div className="bg-school-primary text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 border border-blue-700">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-lg">
                <Download className="w-6 h-6 text-school-accent" />
              </div>
              <div>
                <h4 className="font-bold text-sm">{t('install_app')}</h4>
                <p className="text-xs text-blue-200">{t('install_desc')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleDismiss}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <button 
                onClick={handleInstallClick}
                className="bg-school-accent text-school-primary px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-white transition-colors"
              >
                {t('install')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
