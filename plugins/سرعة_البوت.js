module.exports = {
  command: 'سرعه_البوت',
  description: 'فحص سرعة وأداء البوت (للمطور فقط)',
  category: 'DEVELOPER',
  hidden: true,
  
  async execute(sock, msg) {
    // هذا الـ ID الخاص بك الذي قمنا باستخراجه سابقاً
    const mySecretLid = '272344446701714';
    
    // جلب المعرف الفعلي للمرسل
    let rawSender = msg.key.participant || msg.key.remoteJid || '';
    
    // التحقق الصارم: هل المرسل هو صاحب الـ LID؟
    if (!rawSender.includes(mySecretLid)) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: "🚫 هذا الأمر مخصص فقط للمطور."
      }, { quoted: msg });
    }
    
    const senderNumber = rawSender.split('@')[0];
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
    const cpuTime = process.cpuUsage(cpuStart).user / 1000; 
    
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
    
    await fs.unlink(testFile).catch(() => {});
    
    // فحص 6: سرعة الشبكة
    const net = require('net');
    const netStart = Date.now();
    let netStatus = 'غير متاح';
    try {
      const socket = net.createConnection(80, 'google.com');
      socket.on('connect', () => { socket.end(); });
      netStatus = 'متصل';
    } catch (error) { netStatus = 'فشل الاتصال'; }
    const netTime = Date.now() - netStart;
    
    const totalTime = Date.now() - startTime;
    
    // التقييمات
    let pingGrade = pingTime < 100 ? '🚀 ممتاز' : pingTime < 300 ? '⚡ جيد' : '🐢 بطيء';
    let memoryGrade = memoryUsage.heapUsed < 50 * 1024 * 1024 ? '🟢 ممتاز' : '🟠 متوسط';
    let cpuGrade = cpuTime < 10 ? '🚀 سريع' : '🐢 بطيء';
    
    let speedReport = `⚡ *تقرير سرعة البوت*\n\n` +
                      `📊 *أداء النظام:*\n` +
                      `├ البينج: ${pingTime}ms (${pingGrade})\n` +
                      `└ الوقت الكلي: ${totalTime}ms\n\n` +
                      `🧠 *الذاكرة:* ${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB (${memoryGrade})\n` +
                      `⚙️ *المعالج:* ${cpuTime.toFixed(2)}ms (${cpuGrade})\n` +
                      `💾 *التخزين:* ك:${writeTime}ms | ق:${readTime}ms\n` +
                      `🌐 *الشبكة:* ${netStatus} (${netTime}ms)\n` +
                      `👨‍💻 *المطور:* المالك الرسمي (LID Verified)\n`;
    
    await sock.sendMessage(msg.key.remoteJid, { text: speedReport });
  }
};
