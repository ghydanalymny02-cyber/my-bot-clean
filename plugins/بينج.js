module.exports = {
  command: ['بينج'],
  description: 'فحص سرعة البوت والاتصال',
  category: 'المطور',
  
  async execute(sock, msg, args) {
    try {
      // المطورون المسموح لهم
      const DEVELOPERS = ['967715677073', '967701227385'];
      
      // استخراج رقم المرسل
      const senderJid = msg.key.participant || msg.key.remoteJid;
      const senderNumber = senderJid.split('@')[0];
      
      // التحقق من المطور
      if (!DEVELOPERS.includes(senderNumber)) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: '🚫 هذا الأمر حصري للمطورين'
        });
      }
      
      // إرسال رسالة البداية
      const startTime = Date.now();
      await sock.sendMessage(msg.key.remoteJid, {
        text: '🏓 *جاري فحص سرعة الاتصال...*'
      });
      
      // حساب زمن الاستجابة
      const latency = Date.now() - startTime;
      
      // جلب معلومات إضافية
      const os = require('os');
      const process = require('process');
      
      // معلومات النظام
      const uptime = process.uptime();
      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);
      
      const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
      const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
      const usedMem = (totalMem - freeMem).toFixed(2);
      
      // تقييم السرعة
      let speedRating;
      let speedEmoji;
      
      if (latency < 100) {
        speedRating = 'ممتازة ⭐⭐⭐⭐⭐';
        speedEmoji = '⚡';
      } else if (latency < 300) {
        speedRating = 'جيدة جداً ⭐⭐⭐⭐';
        speedEmoji = '🚀';
      } else if (latency < 600) {
        speedRating = 'جيدة ⭐⭐⭐';
        speedEmoji = '✅';
      } else if (latency < 1000) {
        speedRating = 'متوسطة ⭐⭐';
        speedEmoji = '⚠️';
      } else {
        speedRating = 'بطيئة ⭐';
        speedEmoji = '🐌';
      }
      
      // إرسال النتيجة
      const pingResult = 
        `${speedEmoji} *نتيجة فحص البوت*\n` +
        `═══════════════════════\n\n` +
        
        `🏓 **سرعة الاستجابة:** ${latency}ms\n` +
        `📊 **التقييم:** ${speedRating}\n\n` +
        
        `📈 **معلومات النظام:**\n` +
        `├─ ⏱️ وقت التشغيل: ${hours}س ${minutes}د ${seconds}ث\n` +
        `├─ 💾 الذاكرة: ${usedMem}GB / ${totalMem}GB\n` +
        `├─ 🆓 الذاكرة الحرة: ${freeMem}GB\n` +
        `└─ 📦 Node.js: ${process.version}\n\n` +
        
        `🌐 **حالة الاتصال:**\n` +
        `├─ البوت: ${latency < 500 ? '✅ متصل' : '⚠️ بطيء'}\n` +
        `├─ الواتساب: ${latency < 1000 ? '✅ نشط' : '🟡 متوسط'}\n` +
        `└─ الشبكة: ${latency < 300 ? '✅ ممتازة' : '🟢 جيدة'}\n\n` +
        
        `💡 **التوصيات:**\n` +
        `${latency > 500 ? '• تحقق من سرعة الإنترنت\n' : ''}` +
        `${parseFloat(freeMem) < 1 ? '• الذاكرة منخفضة، جرب `.تنظيف`\n' : ''}` +
        `• راقب الأداء بانتظام\n\n` +
        
        `📌 **الوقت:** ${new Date().toLocaleTimeString('ar-SA')}\n` +
        `═══════════════════════\n` +
        `⚡ *مـــجـــهـــول بوت - الإصدار 2.0*`;
      
      await sock.sendMessage(msg.key.remoteJid, {
        text: pingResult
      });
      
      // إرسال رد إضافي بناءً على النتيجة
      setTimeout(async () => {
        if (latency > 1000) {
          await sock.sendMessage(msg.key.remoteJid, {
            text: '⚠️ *ملاحظة:* السرعة بطيئة\n' +
                  'قد تحتاج إلى:\n' +
                  '1. تحسين اتصال الإنترنت\n' +
                  '2. إعادة تشغيل البوت\n' +
                  '3. التحقق من سيرفر الواتساب'
          });
        } else if (latency < 100) {
          await sock.sendMessage(msg.key.remoteJid, {
            text: '🎉 *ممتاز!* السرعة مثالية\n' +
                  '✅ البوت يعمل بأفضل أداء'
          });
        }
      }, 1000);
      
      // تسجيل في الكونسول
      console.log(`🏓 ${senderNumber} - بينج: ${latency}ms`);
      console.log(`📊 التقييم: ${speedRating}`);
      
    } catch (error) {
      console.error("❌ خطأ في أمر بينج:", error);
      
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ *حدث خطأ في الفحص*\n\n` +
              `🔧 الخطأ: ${error.message || 'غير معروف'}\n` +
              `🕐 الوقت: ${new Date().toLocaleTimeString('ar-SA')}`
      });
    }
  }
};