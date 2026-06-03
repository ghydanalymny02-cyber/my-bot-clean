module.exports = {
  command: 'سرعه_البوت',
  description: 'فحص سرعة وأداء البوت (للمطور فقط)',
  category: 'DEVELOPER',
  hidden: true,
  
  async execute(sock, msg) {
    const devNumbers = ['963996097873', '178817339498583'];
    const senderNumber = (msg.key.participant || msg.key.remoteJid).split('@')[0];
    
    if (!devNumbers.includes(senderNumber)) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: "🚫 هذا الأمر مخصص فقط للمطور."
      }, { quoted: msg });
    }
    
    const startTime = Date.now();
    
    // فحص 1: سرعة الرد (بينج)
    const pingStart = Date.now();
    await sock.sendMessage(msg.key.remoteJid, {
      text: '🏓 فحص السرعة...'
    }, { quoted: msg });
    const pingEnd = Date.now();
    const pingTime = pingEnd - pingStart;
    
    // فحص 2: سرعة جلب معلومات المجموعة
    let groupMetadataTime = 0;
    if (msg.key.remoteJid.endsWith('@g.us')) {
      const groupStart = Date.now();
      try {
        await sock.groupMetadata(msg.key.remoteJid);
        groupMetadataTime = Date.now() - groupStart;
      } catch (error) {
        groupMetadataTime = -1;
      }
    }
    
    // فحص 3: سرعة الذاكرة
    const memoryUsage = process.memoryUsage();
    
    // فحص 4: سرعة المعالج
    const cpuStart = process.cpuUsage();
    let sum = 0;
    for (let i = 0; i < 1000000; i++) {
      sum += Math.random();
    }
    const cpuTime = process.cpuUsage(cpuStart).user / 1000; // بالمللي ثانية
    
    // فحص 5: سرعة القراءة/الكتابة
    const fs = require('fs').promises;
    const path = require('path');
    const testFile = path.join(__dirname, '..', 'data', 'speed_test.txt');
    
    const writeStart = Date.now();
    await fs.writeFile(testFile, 'speed test ' + Date.now(), 'utf8');
    const writeTime = Date.now() - writeStart;
    
    const readStart = Date.now();
    await fs.readFile(testFile, 'utf8');
    const readTime = Date.now() - readStart;
    
    // تنظيف الملف
    await fs.unlink(testFile).catch(() => {});
    
    // فحص 6: سرعة الشبكة
    const net = require('net');
    const netStart = Date.now();
    let netStatus = 'غير متاح';
    try {
      const socket = net.createConnection(80, 'google.com');
      socket.on('connect', () => {
        socket.end();
      });
      netStatus = 'متصل';
    } catch (error) {
      netStatus = 'فشل الاتصال';
    }
    const netTime = Date.now() - netStart;
    
    const totalTime = Date.now() - startTime;
    
    // تقييم السرعة
    let pingGrade = pingTime < 100 ? '🚀 ممتاز' : 
                    pingTime < 300 ? '⚡ جيد' : 
                    pingTime < 600 ? '📶 متوسط' : '🐢 بطيء';
    
    let memoryGrade = memoryUsage.heapUsed < 50 * 1024 * 1024 ? '🟢 ممتاز' :
                      memoryUsage.heapUsed < 100 * 1024 * 1024 ? '🟡 جيد' :
                      memoryUsage.heapUsed < 200 * 1024 * 1024 ? '🟠 متوسط' : '🔴 ثقيل';
    
    let cpuGrade = cpuTime < 10 ? '🚀 سريع' :
                   cpuTime < 30 ? '⚡ جيد' :
                   cpuTime < 50 ? '📶 متوسط' : '🐢 بطيء';
    
    // بناء تقرير السرعة
    let speedReport = `⚡ *تقرير سرعة البوت*\n\n`;
    
    speedReport += `📊 *أداء النظام:*\n`;
    speedReport += `├ وقت التشغيل: ${process.uptime().toFixed(0)} ثانية\n`;
    speedReport += `├ البينج: ${pingTime} مللي ثانية (${pingGrade})\n`;
    speedReport += `└ الوقت الكلي: ${totalTime} مللي ثانية\n\n`;
    
    speedReport += `🧠 *الذاكرة:*\n`;
    speedReport += `├ المستخدم: ${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB\n`;
    speedReport += `├ الكلي: ${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB\n`;
    speedReport += `└ التقييم: ${memoryGrade}\n\n`;
    
    speedReport += `⚙️ *المعالج:*\n`;
    speedReport += `├ وقت المعالجة: ${cpuTime.toFixed(2)} مللي ثانية\n`;
    speedReport += `└ التقييم: ${cpuGrade}\n\n`;
    
    speedReport += `💾 *التخزين:*\n`;
    speedReport += `├ سرعة الكتابة: ${writeTime} مللي ثانية\n`;
    speedReport += `└ سرعة القراءة: ${readTime} مللي ثانية\n\n`;
    
    speedReport += `🌐 *الشبكة:*\n`;
    speedReport += `├ حالة الشبكة: ${netStatus}\n`;
    speedReport += `└ وقت الاتصال: ${netTime} مللي ثانية\n`;
    
    if (groupMetadataTime > 0) {
      speedReport += `\n👥 *المجموعات:*\n`;
      speedReport += `└ جلب معلومات: ${groupMetadataTime} مللي ثانية\n`;
    }
    
    speedReport += `\n📅 *التاريخ:* ${new Date().toLocaleString('ar-SA')}\n`;
    speedReport += `👨‍💻 *المطور:* ${senderNumber}`;
    
    // إضافة نتيجة شاملة
    let overallGrade = '🟢 ممتاز';
    if (pingTime > 500 || cpuTime > 50 || memoryUsage.heapUsed > 150 * 1024 * 1024) {
      overallGrade = '🔴 يحتاج تحسين';
    } else if (pingTime > 300 || cpuTime > 30 || memoryUsage.heapUsed > 100 * 1024 * 1024) {
      overallGrade = '🟡 متوسط';
    }
    
    const finalMessage = `${speedReport}\n\n🏆 *النتيجة الشاملة:* ${overallGrade}`;
    
    await sock.sendMessage(msg.key.remoteJid, {
      text: finalMessage
    });
    
    // إرسال نصائح إذا كانت النتيجة سيئة
    if (overallGrade.includes('🔴')) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await sock.sendMessage(msg.key.remoteJid, {
        text: `💡 *نصائح لتحسين الأداء:*\n\n` +
              `1. إعادة تشغيل البوت 🔄\n` +
              `2. تقليل عدد الأوامر النشطة 📝\n` +
              `3. تنظيف ملفات السجلات 🗑️\n` +
              `4. زيادة ذاكرة الخادم 💾\n` +
              `5. استخدام اتصال إنترنت أفضل 🌐`
      });
    }
  }
};