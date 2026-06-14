const path = require('path');

module.exports = {
  command: 'حضورر',
  description: '🎥 عرض فيديو ثم صوت عند الحضور',
  category: 'fun',

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

    // المسارات الكاملة للملفات
    const videoPath = path.join(__dirname, '../resources/escanor_uncle.mp4');
    const audioPath = path.join(__dirname, '../resources/escanor.m4a');

    try {
      // إرسال الفيديو أولاً
      await sock.sendMessage(jid, {
        video: { url: videoPath },
        caption: 
        
   `❄ *مـــجـــهـــول* ❄ 
يوميلا كسؤت قواعد العالم بأسره...❄
العالم اصبح يخاف ❄مني`
        
        
      }, { quoted: msg });

      // بعده مباشرةً إرسال الصوت
      await sock.sendMessage(jid, {
        audio: { url: audioPath },
        mimetype: 'audio/mpeg', // أو audio/mp4 حسب نوع m4a
        ptt: false
      });

    } catch (err) {
      console.error('✗✗ خطأ في أمر حضورر:', err);
      await sock.sendMessage(jid, {
        text: '❌ حصل خطأ أثناء تشغيل الحضور.',
      }, { quoted: msg });
    }
  }
};