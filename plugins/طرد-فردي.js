const { isElite } = require('../haykala/elite.js');
const { jidDecode } = require('@whiskeysockets/baileys');

// فك التشفير وتحويله إلى @lid
const decode = jid => (jidDecode(jid)?.user || jid.split('@')[0]) + '@lid';

// حظر أرقام محددة من الطرد (حماية)
const protectedIds = ['138174030430382']; 

module.exports = {
  category: 'tools',
  command: "طرد",
  description: "طرد عضو من المجموعة مع إغلاق مؤقت ومنشن قبل الطرد.",
  usage: ".طرد @العضو أو رد على رسالته",

  async execute(sock, msg) {
    try {
      const chatId = msg.key.remoteJid;
      const sender = decode(msg.key.participant || chatId);
      const senderLid = sender.split('@')[0];

      if (!chatId.endsWith('@g.us')) return;

      if (!(await isElite(senderLid))) {
        return sock.sendMessage(chatId, {
          text: '❌ هذا الأمر مخصص فقط للنخبة!'
        }, { quoted: msg });
      }

      const metadata = await sock.groupMetadata(chatId);

      let target = null;

      if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]) {
        target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
      } else if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
        target = msg.message.extendedTextMessage.contextInfo.participant;
      }

      let decodedTarget = null;
      if (target) {
        decodedTarget = decode(target);
      }

      // التحقق: لا يمكن طرد البوت نفسه أو المرسل أو المحميين
      if (
        !decodedTarget || 
        decodedTarget === sock.user.id || 
        decodedTarget === sender || 
        protectedIds.includes(decodedTarget.split('@')[0]) // حماية رقم ID
      ) {
        return sock.sendMessage(chatId, {
          text: '❌ لا يمكنك طرد هذا العضو (محمي).',
        }, { quoted: msg });
      }

      const existsInGroup = metadata.participants.find(p => p.id === decodedTarget);
      if (!existsInGroup) {
        return sock.sendMessage(chatId, {
          text: '❌ لم أتمكن من العثور على العضو المحدد في هذه المجموعة.',
        }, { quoted: msg });
      }

      // قفل المجموعة، منشن، طرد، ثم فتحها
      await sock.groupSettingUpdate(chatId, 'announcement');

      await sock.sendMessage(chatId, {
        text: `@${decodedTarget.split('@')[0]} شوف تحت 👇👇`,
        mentions: [decodedTarget]
      });

      await new Promise(resolve => setTimeout(resolve, 1000));

      await sock.groupParticipantsUpdate(chatId, [decodedTarget], 'remove');

      await sock.sendMessage(chatId, { text: 'منغولي' });

      await sock.groupSettingUpdate(chatId, 'not_announcement');

    } catch (error) {
      console.error('✗ خطأ في أمر الطرد:', error);
      try {
        await sock.groupSettingUpdate(msg.key.remoteJid, 'not_announcement');
      } catch (err) {
        console.error('✗ خطأ في محاولة فتح المجموعة بعد الخطأ:', err);
      }
      await sock.sendMessage(msg.key.remoteJid, {
        text: 'حدث خطأ أثناء تنفيذ الأمر.'
      }, { quoted: msg });
    }
  }
};