// *حقوق مطورة يوميلا  🕸*
// 📄 *للتبادلات.js* (جزء 1/1):

const { isElite, extractPureNumber } = require('../haykala/elite');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');

module.exports = {
  command: 'ت',
  category: 'tools',
  description: '📢 منشن مخفي لإستقبال التبادلات',

  async execute(sock, msg, args = []) {
    try {
      const groupJid = msg.key.remoteJid;
      const senderJid = msg.key.participant || msg.participant || groupJid;
      const senderNumber = extractPureNumber(senderJid);

      if (!groupJid.endsWith('@g.us')) {
        return sock.sendMessage(groupJid, {
          text: '🚫 هذا الأمر يعمل فقط داخل *المجموعات*.'
        }, { quoted: msg });
      }

      if (!isElite(senderNumber)) {
        return sock.sendMessage(groupJid, {
          text: '🔒 *هذا الأمر مخصص لأعضاء النخبة فقط.*\nاطلب من مـــجـــهـــول إضافتك للنخبة إذا كنت تستحق. 👑'
        }, { quoted: msg });
      }

      const metadata = await sock.groupMetadata(groupJid);
      const mentions = metadata.participants.map(p => p.id);

      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const quotedMsgKey = msg.message?.extendedTextMessage?.contextInfo?.stanzaId;
      const quotedParticipant = msg.message?.extendedTextMessage?.contextInfo?.participant;

      if (quoted) {
        const messageType = Object.keys(quoted)[0];

        if (['imageMessage', 'videoMessage', 'audioMessage', 'documentMessage', 'stickerMessage'].includes(messageType)) {
          const stream = await downloadMediaMessage(
            {
              key: { remoteJid: groupJid, id: quotedMsgKey, fromMe: false, participant: quotedParticipant },
              message: quoted
            },
            'buffer',
            {},
            { logger: console }
          );

          const sendObj = {
            mimetype: quoted[messageType].mimetype,
            contextInfo: { mentionedJid: mentions },
          };

          if (messageType === 'imageMessage') sendObj.image = stream;
          else if (messageType === 'videoMessage') sendObj.video = stream;
          else if (messageType === 'audioMessage') sendObj.audio = stream;
          else if (messageType === 'documentMessage') sendObj.document = stream;
          else if (messageType === 'stickerMessage') sendObj.sticker = stream;

          return await sock.sendMessage(groupJid, sendObj, { quoted: msg });

        } else if (quoted.conversation || quoted.extendedTextMessage?.text) {
          const text = quoted.conversation || quoted.extendedTextMessage.text;
          return sock.sendMessage(groupJid, {
            text: `${text}`,
            mentions
          }, { quoted: msg });

        } else {
          return sock.sendMessage(groupJid, {
            text: '⚠️ لا يمكن إعادة إرسال هذا النوع من الرسائل.',
          }, { quoted: msg });
        }

      } else {
        return sock.sendMessage(groupJid, {
          text: `> مــنــوريــن ✧
> تــبــادلــاتــكــمـ خــاصـ ❀
> مـــجـــهـــول ❄ ♚`,
          mentions
        }, { quoted: msg });
      }

    } catch (err) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: `❌ *حدث خطأ داخل كود 𝒏𝒕𝒂:*\n\`\`\`${err.message || err.toString()}\`\`\``
      }, { quoted: msg });
    }
  }
};