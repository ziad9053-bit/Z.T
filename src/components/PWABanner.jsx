import React, { useState, useEffect } from 'react';
import { Download, X, Share, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PWABanner() {
  const [isStandalone, setIsStandalone] = useState(true);
  const [showBanner, setShowBanner] = useState(false);
  const [deviceType, setDeviceType] = useState('desktop'); // ios, android, desktop
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // Check Standalone
    const checkStandalone = () => {
      const isStand = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
      setIsStandalone(!!isStand);
      return !!isStand;
    };

    const isStand = checkStandalone();
    
    // Check Session Storage
    const isDismissed = sessionStorage.getItem('pwa_banner_dismissed') === 'true';

    if (!isStand && !isDismissed) {
      setShowBanner(true);
    }

    // Detect OS & Browser
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    const isAndroid = /android/i.test(ua);
    
    if (isIOS) setDeviceType('ios');
    else if (isAndroid) setDeviceType('android');

    // Detect In-App
    const inApp = /Instagram|WhatsApp|FBAN|FBAV/i.test(ua);
    setIsInAppBrowser(inApp);

    // Save beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      window.deferredPrompt = e; // Global fallback
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen to app installed
    const handleAppInstalled = () => {
      setIsStandalone(true);
      setShowBanner(false);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem('pwa_banner_dismissed', 'true');
  };

  const handleInstallClick = async () => {
    const promptEvent = deferredPrompt || window.deferredPrompt;
    if (promptEvent) {
      promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
      window.deferredPrompt = null;
    } else {
      alert("يرجى استخدام خيارات المتصفح 'إضافة إلى الشاشة الرئيسية' لتثبيته على جهازك.");
    }
  };

  if (isStandalone || !showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-4 left-4 right-4 z-50 flex flex-col gap-3"
        dir="rtl"
      >
        {isInAppBrowser ? (
          <div className="bg-amber-500/90 backdrop-blur-md text-white p-4 rounded-2xl shadow-xl flex items-start gap-4 border border-amber-400/50">
            <Compass className="shrink-0 mt-1" />
            <div className="flex-1 text-sm font-bold leading-relaxed">
              {deviceType === 'ios' ? 
                "لتحميل التطبيق ومتابعة محادثاتك بشكل فاخر، يرجى الضغط على أيقونة المتصفح في الأسفل أو الأعلى واختيار 'الفتح في Safari' (Open in Safari)."
                :
                "للحصول على تجربة متكاملة وتثبيت التطبيق، يرجى الضغط على خيارات المتصفح (النقاط الثلاث) واختيار 'الفتح في متصفح Chrome'."
              }
            </div>
            <button onClick={handleDismiss} className="p-1 bg-black/10 rounded-full hover:bg-black/20"><X size={18}/></button>
          </div>
        ) : (
          <>
            {deviceType === 'ios' ? (
              <div className="bg-blue-600/90 backdrop-blur-md text-white p-4 rounded-2xl shadow-xl flex items-start gap-4 border border-blue-400/50">
                <Share className="shrink-0 mt-1" />
                <div className="flex-1 text-sm font-bold leading-relaxed">
                  للحصول على تجربة راقية مع تطبيقنا، اضغط على زر المشاركة ⎋ ثم اختر 'إضافة إلى الشاشة الرئيسية' ➕
                </div>
                <button onClick={handleDismiss} className="p-1 bg-black/10 rounded-full hover:bg-black/20"><X size={18}/></button>
              </div>
            ) : (
              <div className="bg-zinc-800/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-xl flex items-center gap-4 border border-emerald-500/30">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                  <Download size={24} className="text-black" />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-emerald-400 text-sm">ثبت التطبيق الفاخر على جوالك</h3>
                  <p className="text-white/60 text-xs mt-1">تواصل أسرع وبدون قيود.</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={handleInstallClick} className="bg-emerald-500 text-black px-4 py-2 rounded-xl text-xs font-black shadow-md hover:bg-emerald-400 transition-all">تثبيت</button>
                  <button onClick={handleDismiss} className="text-white/40 text-[10px] hover:text-white transition-all text-center">ليس الآن</button>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
