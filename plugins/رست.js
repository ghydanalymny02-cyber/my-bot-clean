// 📄 رست.js
const { exec } = require('child_process');

module.exports = {
  command: ['رست'],
  description: 'إعادة تشغيل البوت تلقائيًا',
  category: 'النظام',

  async execute(sock, msg) {
    try {
      const jid = msg.key.remoteJid;

      // رسالة تأكيد
      await sock.sendMessage(jid, {
        text: `🔄『 إعادة تشغيل البوت 』
⚡ سيتم إعادة التشغيل الآن...`
      });

      console.log('🔄 جاري إعادة تشغيل البوت...');

      // تشغيل نسخة جديدة من البوت
      exec('node .', (error, stdout, stderr) => {
        if (error) {
          console.error(`💥 خطأ أثناء إعادة التشغيل: ${error.message}`);
          return;
        }
        if (stderr) console.error(`⚠️ تحذير: ${stderr}`);
        console.log(`✅ البوت أعيد تشغيله:\n${stdout}`);
      });

      // إيقاف العملية الحالية
      process.exit(0);

    } catch (error) {
      console.error('💥 خطأ في أمر رست:', error);
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ حدث خطأ أثناء محاولة إعادة التشغيل:\n${error.message}`
      });
    }
  }
};