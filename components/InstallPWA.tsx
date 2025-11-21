
import React, { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';

export const InstallPWA: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsStandalone(true);
    }

    // Check if iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    // Chrome/Android Install Prompt Listener
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

  // Don't show if already installed
  if (isStandalone) return null;

  // iOS Instructions
  if (isIOS && !isStandalone) {
    // Simple logic: Show once per session or persistent? 
    // For now, we keep it simple: let user dismiss it.
    // You could save 'ios-prompt-dismissed' to localStorage.
  }

  if (!showInstallBtn && !isIOS) return null;

  return (
    <>
      {/* Android / Chrome Button */}
      {showInstallBtn && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-auto z-50 animate-fade-in-up no-print">
          <div className="bg-school-primary text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 border border-blue-700">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-lg">
                <Download className="w-6 h-6 text-school-accent" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Install App</h4>
                <p className="text-xs text-blue-200">Add to Home Screen for better experience</p>
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
                Install
              </button>
            </div>
          </div>
        </div>
      )}

      {/* iOS Instructions (Only if we decide to show them) */}
      {/* Usually handled by a specific button triggering a modal, simplified for now */}
    </>
  );
};
