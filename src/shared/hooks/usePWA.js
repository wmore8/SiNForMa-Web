import { useState, useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export function usePWA() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ', r);
    },
    onRegisterError(error) {
      console.error('SW registration error', error);
    },
  });

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
      setIsInstalled(true);
    }
  };

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  return {
    canInstall: !!installPrompt && !isInstalled,
    isInstalled,
    isInstallSupported: 'BeforeInstallPromptEvent' in window,
    needRefresh,
    handleInstall,
    handleUpdate,
  };
}
