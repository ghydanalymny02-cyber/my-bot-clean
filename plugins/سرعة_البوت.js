module.exports = {
  command: 'سرعه_البوت',
  description: 'فحص سرعة وأداء البوت (للمطور فقط)',
  category: 'DEVELOPER',
  hidden: true,
  
  async execute(sock, msg) {
    // قائمة الـ IDs المعتمدة (المطورين)
    const allowedLids = [
      '272344446701714', 
      '106790838616138'
    ];
    
    // جلب المعرف الفعلي للمرسل
    let rawSender = msg.key.participant || msg.key.remoteJid || '';
    
    // التحقق: هل المرسل يحتوي على أحد الـ IDs المعتمدة؟
    const isAuthorized = allowedLids.some(lid => rawSender.includes(lid));
    
    if (!isAuthorized) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: "🚫 هذا الأمر مخصص فقط للمطورين المصرح لهم."
      }, { quoted: msg });
    }
    
    // ... باقي الكود كما هو (بداية الفحص)
    const startTime = Date.now();
    
    // فحص 1: سرعة الرد (بينج)
    const pingStart = Date.now();
    // نستخدم updateMessage بدلاً من sendMessage لنفس الرسالة لتقليل الترافيك
    const pingMsg = await sock.sendMessage(msg.key.remoteJid, { text: '🏓 فحص السرعة...' }, { quoted: msg });
    const pingEnd = Date.now();
    const pingTime = pingEnd - pingStart;
    
    // فحص 2: سرعة جلب معلومات المجموعة
    let groupMetadataTime = 0;
    if (msg.key.remoteJid.endsWith('@g.us')) {
      const groupStart = Date.now();
      try {
        await sock.groupMetadata(msg.key.remoteJid);
        groupMetadataTime = Date.now() - groupStart;
      } catch (error) { groupMetadataTime = -1; }
    }
    
    // فحص 3: سرعة الذاكرة
    const memoryUsage = process.memoryUsage();
    
    // فحص 4: سرعة المعالج (مبسط لتجنب التعليق)
    const cpuStart = process.cpuUsage();
    const cpuTime = process.cpuUsage(cpuStart).user / 1000; 
    
    // فحص 5: سرعة التخزين (بشكل آمن)
    const fs = require('fs').promises;
    const path = require('path');
    const testFile = path.join(__dirname, '..', 'data', 'speed_test.txt');
    
    const writeStart = Date.now();
    await fs.writeFile(testFile, 'test', 'utf8').catch(() => {});
    const writeTime = Date.now() - writeStart;
    await fs.unlink(testFile).catch(() => {});
    
    const totalTime = Date.now() - startTime;
    
    // التقييمات
    let pingGrade = pingTime < 100 ? '🚀 ممتاز' : pingTime < 300 ? '⚡ جيد' : '🐢 بطيء';
    
    let speedReport = `⚡ *تقرير سرعة البوت*\n\n` +
                      `📊 *أداء النظام:*\n` +
                      `├ البينج: ${pingTime}ms (${pingGrade})\n` +
                      `└ الوقت الكلي: ${totalTime}ms\n\n` +
                      `🧠 *الذاكرة:* ${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB\n` +
                      `⚙️ *المعالج:* ${cpuTime.toFixed(2)}ms\n` +
                      `💾 *التخزين:* ${writeTime}ms\n` +
                      `👨‍💻 *الحالة:* المطور (LID Verified)\n`;
    
    await sock.sendMessage(msg.key.remoteJid, { text: speedReport }, { quoted: pingMsg });
  }
};
