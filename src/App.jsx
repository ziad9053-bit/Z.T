import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Settings2, X, Save, Sparkles, RefreshCcw } from 'lucide-react';
import PWABanner from './components/PWABanner';

export default function App() {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [countryCode, setCountryCode] = useState('966');
  
  // مصفوفة الرسائل قابلة للتعديل (نحملها من الذاكرة المحلية)
  const [customMessages, setCustomMessages] = useState([
    { id: 1, label: 'تحية', text: 'السلام عليكم ورحمة الله وبركاته' },
    { id: 2, label: 'استفسار', text: 'هل هذا المنتج لا يزال متوفراً؟' },
  ]);

  // حفظ واسترجاع الإعدادات
  useEffect(() => {
    const saved = localStorage.getItem('wa_matrix_settings');
    if (saved) setCustomMessages(JSON.parse(saved));
  }, []);

  const saveSettings = (newMessages) => {
    setCustomMessages(newMessages);
    localStorage.setItem('wa_matrix_settings', JSON.stringify(newMessages));
    setShowSettings(false);
  };

  const cleanAndSend = () => {
    if (!phone) return;
    
    // دالة تنظيف الرقم الذكية
    let finalPhone = phone.trim();
    // حذف أي علامة + أو أصفار دولية
    finalPhone = finalPhone.replace(/^(\+00|\+0|00|\+)/, '');
    
    // إذا كان الرقم يبدأ برمز الدولة المختار، قم بحذفه
    if (finalPhone.startsWith(countryCode)) {
      finalPhone = finalPhone.substring(countryCode.length);
    }
    
    // حذف الصفر المحلي في البداية إن وجد (مثل 055...)
    finalPhone = finalPhone.replace(/^0+/, '');

    const url = `https://wa.me/${countryCode}${finalPhone}${message ? '?text=' + encodeURIComponent(message) : ''}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-cairo flex items-center justify-center p-4 relative overflow-hidden" dir="rtl">
      <PWABanner />
      
      {/* الواجهة الرئيسية */}
      <motion.div className="w-full max-w-md bg-zinc-900 border border-white/5 p-8 rounded-[3rem] shadow-2xl relative z-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-black text-emerald-400">ماتريكس الذكي</h1>
          <button onClick={() => setShowSettings(true)} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
            <Settings2 size={20} className="text-white/60" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-black/50 p-4 rounded-3xl border border-white/5">
            <label className="text-[10px] font-bold text-white/30 mr-2 mb-2 block uppercase">الرقم الذكي</label>
            <div className="flex items-center gap-3">
              <span className="text-emerald-500 font-black">+{countryCode}</span>
              <input 
                type="tel" 
                placeholder="أدخل الرقم هنا..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-transparent border-none focus:ring-0 w-full font-black text-xl placeholder:text-white/5"
              />
            </div>
          </div>

          {/* مصفوفة الرسائل من الإعدادات */}
          <div className="grid grid-cols-2 gap-3">
            {customMessages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => setMessage(msg.text)}
                className={`p-4 rounded-2xl border text-right transition-all text-xs ${
                  message === msg.text ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/5 bg-black/20'
                }`}
              >
                <p className="font-bold text-emerald-400 mb-1">{msg.label}</p>
                <p className="text-white/40 truncate">{msg.text}</p>
              </button>
            ))}
          </div>

          <button 
            onClick={cleanAndSend}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xl py-5 rounded-[2rem] flex items-center justify-center gap-3 transition-all"
          >
            <Send size={24} /> مراسلة فورية
          </button>
        </div>
      </motion.div>

      {/* مودال الإعدادات (Settings Overlay) */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="w-full max-w-md bg-zinc-900 border border-white/10 p-6 rounded-[2.5rem]"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2"><Settings2 size={20}/> تخصيص المصفوفة</h2>
                <button onClick={() => setShowSettings(false)}><X size={24}/></button>
              </div>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {customMessages.map((msg, index) => (
                  <div key={msg.id} className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-3">
                    <input 
                      placeholder="عنوان الصف (مثلاً: تحية)"
                      value={msg.label}
                      onChange={(e) => {
                        const newMsgs = [...customMessages];
                        newMsgs[index].label = e.target.value;
                        setCustomMessages(newMsgs);
                      }}
                      className="w-full bg-white/5 border-none rounded-xl p-2 text-sm font-bold text-emerald-400"
                    />
                    <textarea 
                      placeholder="نص الرسالة..."
                      value={msg.text}
                      onChange={(e) => {
                        const newMsgs = [...customMessages];
                        newMsgs[index].text = e.target.value;
                        setCustomMessages(newMsgs);
                      }}
                      className="w-full bg-white/5 border-none rounded-xl p-2 text-xs text-white/60 resize-none"
                    />
                  </div>
                ))}
              </div>

              <button 
                onClick={() => saveSettings(customMessages)}
                className="w-full mt-6 bg-white text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2"
              >
                <Save size={20} /> حفظ التغييرات
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
