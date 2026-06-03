module.exports = {
  command: ['النظام'],
  description: 'لوحة تحكم النظام المتكاملة',
  category: 'المطور',
  
  async execute(sock, msg, args) {
    try {
      // المطورون المسموح لهم
      const DEVELOPERS = ['967 715 677 073', '178817339498583'];
      
      // استخراج رقم المرسل
      const senderJid = msg.key.participant || msg.key.remoteJid;
      const senderNumber = senderJid.split('@')[0];
      
      // التحقق من المطور
      if (!DEVELOPERS.includes(senderNumber)) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: '🚫 هذا الأمر حصري للمطورين'
        });
      }
      
      // إرسال رسالة الانتظار
      await sock.sendMessage(msg.key.remoteJid, {
        text: '🔄 جاري تحميل معلومات النظام...'
      });
      
      // استيراد المكتبات
      const os = require('os');
      const process = require('process');
      
      // 1. معلومات النظام الأساسية
      const platform = os.platform();
      const arch = os.arch();
      const release = os.release();
      const hostname = os.hostname();
      const type = os.type();
      
      // 2. معلومات المعالج (بمعالجة الخطأ)
      let cpuInfo = 'غير متوفر';
      try {
        const cpus = os.cpus();
        if (cpus && cpus.length > 0 && cpus[0]) {
          const cpuModel = cpus[0].model || 'غير معروف';
          const cpuCores = cpus.length;
          const cpuSpeed = cpus[0].speed ? `${cpus[0].speed} MHz` : 'غير معروف';
          cpuInfo = `${cpuModel} | ${cpuCores} نواة | ${cpuSpeed}`;
        } else {
          cpuInfo = 'معلومات غير متاحة';
        }
      } catch (cpuErr) {
        cpuInfo = `خطأ في القراءة: ${cpuErr.message}`;
      }
      
      // 3. معلومات الذاكرة
      const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
      const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
      const usedMem = (totalMem - freeMem).toFixed(2);
      const memUsage = totalMem > 0 ? ((usedMem / totalMem) * 100).toFixed(1) : '0.0';
      
      // 4. وقت تشغيل النظام
      const uptime = process.uptime();
      const uptimeHours = Math.floor(uptime / 3600);
      const uptimeMinutes = Math.floor((uptime % 3600) / 60);
      const uptimeSeconds = Math.floor(uptime % 60);
      
      // 5. معلومات البوت
      const nodeVersion = process.version;
      const botStartTime = new Date(Date.now() - (uptime * 1000));
      const processMemory = process.memoryUsage();
      const heapUsed = (processMemory.heapUsed / 1024 / 1024).toFixed(2);
      const heapTotal = (processMemory.heapTotal / 1024 / 1024).toFixed(2);
      const rss = (processMemory.rss / 1024 / 1024).toFixed(2);
      
      // 6. معلومات النظام العام
      let loadAvgInfo = 'غير متوفر';
      try {
        const loadAvg = os.loadavg();
        if (loadAvg && loadAvg.length >= 3) {
          loadAvgInfo = `${loadAvg[0].toFixed(2)}, ${loadAvg[1].toFixed(2)}, ${loadAvg[2].toFixed(2)}`;
        }
      } catch (loadErr) {
        loadAvgInfo = 'خطأ في القراءة';
      }
      
      // 7. معلومات المستخدم
      let userInfo = 'غير متوفر';
      try {
        const user = os.userInfo();
        userInfo = user.username || 'غير معروف';
      } catch (userErr) {
        userInfo = 'غير قابل للقراءة';
      }
      
      // 8. معلومات الشبكة
      let networkInfo = 'غير متوفر';
      try {
        const networkInterfaces = os.networkInterfaces();
        const interfaces = [];
        
        for (const [name, ifaces] of Object.entries(networkInterfaces)) {
          if (ifaces && ifaces.length > 0) {
            for (const iface of ifaces) {
              if (iface && iface.family === 'IPv4' && !iface.internal) {
                interfaces.push(`${name}: ${iface.address}`);
              }
            }
          }
        }
        
        networkInfo = interfaces.length > 0 ? interfaces.join('\n') : 'لا توجد واجهات شبكة';
      } catch (netErr) {
        networkInfo = `خطأ: ${netErr.message}`;
      }
      
      // 9. حالة النظام
      const systemStatus = {
        bot: '✅ نشط',
        connection: '🔗 مستقر',
        performance: parseFloat(memUsage) > 80 ? '⚠️ مرتفع' : '✅ جيد',
        memory: parseFloat(memUsage) > 85 ? '🟡 متوسطة' : '🟢 جيدة',
        security: '🛡️ مفعلة'
      };
      
      // 10. تنبيهات النظام
      const alerts = [];
      if (parseFloat(memUsage) > 85) alerts.push('⚠️ استخدام الذاكرة مرتفع');
      if (parseFloat(usedMem) > 7 && parseFloat(totalMem) < 10) alerts.push('⚠️ ذاكرة حرة قليلة');
      if (uptimeHours > 24) alerts.push('ℹ️ النظام يعمل لأكثر من 24 ساعة');
      
      // إنشاء تقرير النظام
      const systemReport = 
        `🖥️ *لوحة تحكم النظام - يوميلا بوت*\n` +
        `═══════════════════════════\n\n` +
        
        `📊 *معلومات النظام الأساسية:*\n` +
        `├─ 🏷️ النظام: ${platform} (${arch})\n` +
        `├─ 📦 النوع: ${type}\n` +
        `├─ 🏗️ الإصدار: ${release}\n` +
        `├─ 🖥️ الجهاز: ${hostname}\n` +
        `├─ 👤 المستخدم: ${userInfo}\n` +
        `└─ 🕐 التوقيت: ${new Date().toLocaleTimeString('ar-SA')}\n\n` +
        
        `⚙️ *معلومات المعالج:*\n` +
        `└─ ${cpuInfo}\n\n` +
        
        `💾 *معلومات الذاكرة:*\n` +
        `├─ 📊 الإجمالي: ${totalMem} GB\n` +
        `├─ 📈 المستخدم: ${usedMem} GB (${memUsage}%)\n` +
        `├─ 📉 الحر: ${freeMem} GB\n` +
        `└─ ⚡ الحالة: ${parseFloat(memUsage) > 80 ? 'مرتفعة ⚠️' : 'طبيعية ✅'}\n\n` +
        
        `🤖 *معلومات البوت:*\n` +
        `├─ 🚀 وقت البدء: ${botStartTime.toLocaleString('ar-SA')}\n` +
        `├─ ⏱️ وقت التشغيل: ${uptimeHours}س ${uptimeMinutes}د ${uptimeSeconds}ث\n` +
        `├─ 📦 Node.js: ${nodeVersion}\n` +
        `├─ 🧠 Heap: ${heapUsed}MB / ${heapTotal}MB\n` +
        `└─ 📊 RSS: ${rss}MB\n\n` +
        
        `📈 *معلومات الأداء:*\n` +
        `├─ 📊 حمل النظام: ${loadAvgInfo}\n` +
        `└─ 🌐 الشبكة: ${networkInfo.split('\n')[0] || 'غير متوفر'}\n\n` +
        
        `📊 *الحالة الحالية:*\n` +
        `├─ البوت: ${systemStatus.bot}\n` +
        `├─ الاتصال: ${systemStatus.connection}\n` +
        `├─ الأداء: ${systemStatus.performance}\n` +
        `├─ الذاكرة: ${systemStatus.memory}\n` +
        `└─ الحماية: ${systemStatus.security}\n\n` +
        
        `🔔 *التنبيهات:*\n` +
        `${alerts.length > 0 ? alerts.map(alert => `• ${alert}`).join('\n') : '✅ لا توجد تنبيهات حرجة'}\n\n` +
        
        `💡 *التوصيات:*\n` +
        `${parseFloat(memUsage) > 80 ? '• استخدم `.تنظيف` لتحرير الذاكرة\n' : ''}` +
        `${uptimeHours > 24 ? '• يفضل إعادة التشغيل للصيانة الدورية\n' : ''}` +
        `• راقب أداء النظام بانتظام\n\n` +
        
        `📌 *آخر تحديث:* ${new Date().toLocaleString('ar-SA')}\n` +
        `═══════════════════════════\n` +
        `⚡ *مطورة يوميلا - الإصدار 2.1*`;
      
      // إرسال التقرير
      await sock.sendMessage(msg.key.remoteJid, {
        text: systemReport
      });
      
      // إرسال معلومات إضافية إذا كانت الشبكة طويلة
      if (networkInfo.includes('\n')) {
        setTimeout(async () => {
          await sock.sendMessage(msg.key.remoteJid, {
            text: `🌐 *معلومات الشبكة الإضافية:*\n\`\`\`\n${networkInfo}\n\`\`\``
          });
        }, 500);
      }
      
      // تسجيل في الكونسول
      console.log(`📊 ${senderNumber} طلب معلومات النظام`);
      console.log(`💾 الذاكرة: ${usedMem}GB/${totalMem}GB (${memUsage}%)`);
      console.log(`⏱️ وقت التشغيل: ${uptimeHours}ساعة`);
      
    } catch (error) {
      console.error("❌ خطأ في أمر النظام:", error);
      
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ *حدث خطأ في تحميل معلومات النظام*\n\n` +
              `🔧 الخطأ: ${error.message || 'غير معروف'}\n` +
              `📍 الملف: ${__filename}\n` +
              `🕐 الوقت: ${new Date().toLocaleString('ar-SA')}`
      });
    }
  }
};