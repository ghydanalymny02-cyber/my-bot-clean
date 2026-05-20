// commands/الخاص-فتح.js
const fs = require('fs');
const path = require('path');
const { isElite } = require('../haykala/elite.js'); // لازم يتصدّر isElite في الملف ده

module.exports = {
  command: 'الخاص-فتح',
  category: 'DEVELOPER',
  description: 'فتح الخاص للبوت (للنخبة فقط)',
  usage: '.الخاص-فتح',

  async execute(sock, msg, args) {
    try {
      // جَب رقم المرسل بطريقة آمنة (شغال في جروب و في خاص)
      const jid = msg.key.participant || msg.key.remoteJid || '';
      const senderNumber = jid.split('@')[0];

      // تأكد إن اللي بيستخدم الأمر من النخبة
      if (!isElite(senderNumber)) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: '⚠️ هذا الأمر مخصص للنخبة فقط.'
        }, { quoted: msg });
      }

      const privatePath = path.join(__dirname, '../data/private.txt');
      let privateStatus = '[off]';

      if (fs.existsSync(privatePath)) {
        privateStatus = fs.readFileSync(privatePath, 'utf8').trim();
      }

      // لو مفتوح بالفعل
      if (privateStatus === '[on]') {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: '⚠️ الخاص مفتوح بالفعل.'
        }, { quoted: msg });
      }

      // لو مقفول → افتحه
      fs.writeFileSync(privatePath, '[on]', 'utf8');

      await sock.sendMessage(msg.key.remoteJid, {
        text: '✅ تم فتح الخاص بنجاح. دلوقتي أي حد يقدر يكلمني في الخاص.'
      }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر الخاص-فتح:', err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ حصل خطأ أثناء فتح الخاص.'
      }, { quoted: msg });
    }
  }
};