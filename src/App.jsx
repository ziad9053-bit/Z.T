import React, { useState } from 'react';
import { MessageCircle, Send, AlignLeft } from 'lucide-react';

export default function App() {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState(''); // حالة جديدة للنص
  const [countryCode, setCountryCode] = useState('966');

  const openWhatsApp = () => {
    if (!phone) return alert('الرجاء إدخال رقم الهاتف');
    
    let cleanPhone = phone.replace(/^0+/, '');
    
    // تحويل النص إلى صيغة يفهمها الرابط (URL Encoding)
    const encodedMessage = encodeURIComponent(message);
    
    // إنشاء الرابط مع النص
    const url = `https://wa.me/${countryCode}${cleanPhone}${message ? '?text=' + encodedMessage : ''}`;
    
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4 font-cairo" dir="rtl">
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-white">
        
        {/* الهيدر */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-[#25D366] rounded-[2rem] flex items-center justify-center mb-4 shadow-xl shadow-green-200 rotate-3">
            <MessageCircle size={40} className="text-white -rotate-3" />
          </div>
          <h1 className="text-3xl font-black text-slate-800">مراسل واتساب</h1>
        </div>

        <div className="space-y-6">
          {/* حقول الرقم */}
          <div className="flex gap-3">
            <div className="w-28">
              <label className="text-xs font-bold text-slate-400 mb-2 block mr-2">الكود</label>
              <input 
                type="text" 
                value={countryCode} 
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-green-500 focus:outline-none text-center font-black text-lg"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-bold text-slate-400 mb-2 block mr-2">رقم الجوال</label>
              <input 
                type="tel" 
                placeholder="5xxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-green-500 focus:outline-none font-black text-lg"
              />
            </div>
          </div>

          {/* خانة نص الرسالة */}
          <div>
            <label className="text-xs font-bold text-slate-400 mb-2 block mr-2">الرسالة (اختياري)</label>
            <div className="relative">
              <textarea 
                rows={3}
                placeholder="اكتب رسالتك هنا..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-green-500 focus:outline-none font-medium resize-none"
              />
              <AlignLeft size={18} className="absolute left-4 bottom-4 text-slate-300" />
            </div>
          </div>

          {/* زر الإرسال */}
          <button 
            onClick={openWhatsApp}
            className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-black text-xl py-5 rounded-3xl shadow-xl shadow-green-100 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <Send size={24} />
            فتح المحادثة
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-around">
           {/* أزرار سريعة للنصوص الجاهزة */}
           <button 
             onClick={() => setMessage('السلام عليكم ورحمة الله')}
             className="text-[10px] bg-slate-100 px-3 py-1 rounded-full text-slate-500 hover:bg-green-100 hover:text-green-600 transition-colors"
           >
             تحية الإسلام
           </button>
           <button 
             onClick={() => setMessage('هل المنتج متوفر؟')}
             className="text-[10px] bg-slate-100 px-3 py-1 rounded-full text-slate-500 hover:bg-green-100 hover:text-green-600 transition-colors"
           >
             استفسار عن منتج
           </button>
        </div>
      </div>
    </div>
  );
}
