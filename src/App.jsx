import React, { useState } from 'react';
import { motion } from 'framer-motion'; // للموشن والتحريك السلس
import { MessageCircle, Send, History, Grid, Settings2, Sparkles } from 'lucide-react';

export default function App() {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const quickMessages = [
    { id: 1, label: 'تحية', text: 'السلام عليكم ورحمة الله وبركاته' },
    { id: 2, label: 'استفسار', text: 'هل هذا المنتج لا يزال متوفراً؟' },
    { id: 3, label: 'موقع', text: 'ممكن ترسل لي موقع المحل فضلاً؟' },
    { id: 4, label: 'شكر', text: 'شكراً جزيلاً، سعدت بالتعامل معكم' },
  ];

  const handleSend = () => {
    if (!phone) return;
    const url = `https://wa.me/966${phone.replace(/^0+/, '')}${message ? '?text=' + encodeURIComponent(message) : ''}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-cairo flex items-center justify-center p-4 overflow-hidden relative" dir="rtl">
      
      {/* خلفية فنية (Mesh Gradients) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative z-10"
      >
        {/* الهيدر */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-l from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              ماتريكس واتساب
            </h1>
            <p className="text-white/40 text-sm mt-1">تواصل بذكاء، وبدون قيود</p>
          </div>
          <div className="p-3 bg-emerald-500/20 rounded-2xl border border-emerald-500/30">
            <Sparkles className="text-emerald-400" size={24} />
          </div>
        </div>

        {/* حقل الرقم */}
        <div className="space-y-6">
          <div className="relative group">
            <label className="text-xs font-bold text-white/30 mr-4 mb-2 block uppercase tracking-widest">رقم الجوال (السعودية)</label>
            <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl p-2 focus-within:border-emerald-500/50 transition-all">
              <span className="px-4 text-emerald-400 font-black border-l border-white/10">+966</span>
              <input 
                type="tel" 
                placeholder="5xxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-transparent border-none focus:ring-0 w-full p-3 font-black text-xl tracking-widest placeholder:text-white/10"
              />
            </div>
          </div>

          {/* مصفوفة الرسائل الجاهزة */}
          <div>
            <label className="text-xs font-bold text-white/30 mr-4 mb-4 block uppercase tracking-widest">مصفوفة الرسائل السريعة</label>
            <div className="grid grid-cols-2 gap-3">
              {quickMessages.map((msg) => (
                <motion.button
                  key={msg.id}
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setMessage(msg.text)}
                  className={`p-4 rounded-2xl border text-right transition-all ${
                    message === msg.text ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/5 bg-white/5'
                  }`}
                >
                  <p className="text-xs font-bold text-emerald-400 mb-1">{msg.label}</p>
                  <p className="text-[10px] text-white/60 truncate">{msg.text}</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* حقل النص المخصص */}
          <div className="relative">
             <textarea 
              rows={3}
              placeholder="أو اكتب رسالة مخصصة هنا..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-blue-500/50 focus:outline-none transition-all resize-none text-sm placeholder:text-white/10"
            />
          </div>

          {/* الزر الرئيسي */}
          <motion.button 
            whileHover={{ scale: 1.02, shadow: "0 0 20px rgba(16, 185, 129, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSend}
            className="w-full bg-gradient-to-l from-emerald-500 to-emerald-600 text-[#0f172a] font-black text-xl py-5 rounded-[1.5rem] flex items-center justify-center gap-3 shadow-xl"
          >
            <Send size={24} />
            إطلاق المحادثة
          </motion.button>
        </div>

        {/* الفوتر - الأرقام الأخيرة */}
        <div className="mt-10 pt-6 border-t border-white/5 flex justify-between items-center text-white/20">
          <div className="flex gap-2">
            <History size={16} />
            <span className="text-[10px] font-bold">الأرقام الأخيرة</span>
          </div>
          <div className="flex gap-2">
            <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10" />
            <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10" />
            <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
