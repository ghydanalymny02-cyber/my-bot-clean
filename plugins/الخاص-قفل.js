// commands/الخاص-قفل.js
const fs = require('fs');
const path = require('path');
const { isElite } = require('../haykala/elite.js'); // لازم يتصدّر isElite في الملف ده

module.exports = {
  command: 'الخاص-قفل',
  category: 'DEVELOPER',
  description: 'قفل الخاص للبوت (للنخبة فقط)',
  usage: '.الخاص-قفل',

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
      let privateStatus = '[on]';

      if (fs.existsSync(privatePath)) {
        privateStatus = fs.readFileSync(privatePath, 'utf8').trim();
      }

      // لو مقفول بالفعل
      if (privateStatus === '[off]') {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: '⚠️ الخاص مقفول بالفعل.'
        }, { quoted: msg });
      }

      // لو مفتوح → اقفله
      fs.writeFileSync(privatePath, '[off]', 'utf8');

      await sock.sendMessage(msg.key.remoteJid, {
        text: '🔒 تم قفل الخاص بنجاح. أي حد مش من النخبة هيتم بلوكه لو بعت في الخاص.'
      }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر الخاص-قفل:', err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ حصل خطأ أثناء قفل الخاص.'
      }, { quoted: msg });
    }
  }
};