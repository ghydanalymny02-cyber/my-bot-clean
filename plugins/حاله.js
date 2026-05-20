const fs = require('fs');
const path = require('path');
const { isElite } = require('../haykala/elite.js');

module.exports = {
  command: 'حاله',
  description: '🏓 اختبار سرعة استجابة البوت (للمطورين فقط)',
  usage: '.ping',
  category: 'tools',

  async execute(sock, msg) {
    try {
      const from = msg.key.remoteJid;
      const userJid = msg.key.participant || from;

      // التحقق من النخبة
      if (!isElite(userJid)) {
        return await sock.sendMessage(from, {
          text: '❌ عفواً، هذا الأمر مخصص للمطورين فقط!'
        }, { quoted: msg });
      }

      const start = Date.now();

      // رسالة تحميل مؤقتة
      const loadingMsg = await sock.sendMessage(from, {
        text: '❄️ *جاري اختبار سرعة الاتصال...*'
      }, { quoted: msg });

      const end = Date.now();
      const ping = end - start;

      // تصميم معدل للنخبة بنفس شكل النص المطلوب
      const mensaje = `
╭─────────────────────────╮
│   👑 *بوت النخبة - الحالة* 👑
├─────────────────────────┤
│ 🟢 *الاتصال:* *جاهز سيدي*
│ 📶 *السرعة:* ${ping} مللي ثانية
│ ⚡ *الحالة:* يعمل بكفاءة 100%
│ 👤 *المستخدم:* *عمك غوجو*
╰─────────────────────────╯
`;

      await sock.sendMessage(from, {
        text: mensaje,
        footer: '𝑬𝑺𝑪𝑨𝑵𝑶𝑹⊰𝑩𝑶𝑻 🌋',
        buttons: [
          {
            buttonId: '.اوامر',
            buttonText: { displayText: '📜 قائمة الأوامر' },
            type: 1
          }
        ],
        headerType: 1
      }, { quoted: msg });

     

    } catch (err) {
      console.error('❌ خطأ في أمر ping:', err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: `⚠️ حدث خطأ أثناء تنفيذ الأمر:\n${err.message}`
      }, { quoted: msg });
    }
  }
};