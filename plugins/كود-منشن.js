const fs = require("fs");
const { isElite, extractPureNumber } = require('../haykala/elite');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');

module.exports = {
  command: 'تفاعل',
  category: 'tools',
  description: 'منشن جماعي للكل، أو إعادة إرسال الرسالة المردود عليها كمنشن خفي (للنخبة فقط)',

  async execute(sock, msg, args = []) {
    try {
      const groupJid = msg.key.remoteJid;
      const senderJid = msg.key.participant || msg.participant || groupJid;
      const senderNumber = extractPureNumber(senderJid);

      if (!groupJid.endsWith('@g.us')) {
        return sock.sendMessage(groupJid, { text: '❌ هذا الأمر يعمل فقط في القروبات.' }, { quoted: msg });
      }

      if (!isElite(senderNumber)) {
        return sock.sendMessage(groupJid, { text: '🚫 هذا الأمر مخصص للنخبة فقط.' }, { quoted: msg });
      }

      const metadata = await sock.groupMetadata(groupJid);
      const mentions = metadata.participants.map(p => p.id);

      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const quotedMsgKey = msg.message?.extendedTextMessage?.contextInfo?.stanzaId;
      const quotedParticipant = msg.message?.extendedTextMessage?.contextInfo?.participant;

      const imagePath = "image.jpeg";
      const hasImage = fs.existsSync(imagePath);
      const imageBuffer = hasImage ? fs.readFileSync(imagePath) : null;

      const externalReply = {
        title: "𝑭𝑶𝑿 𝑩𝑶𝑻 ⚡",
        body: "منشن جماعي أو منشن خفي ✅",
        thumbnail: imageBuffer,
        mediaType: 1,
        sourceUrl: "https://t.me/FOX143",
        renderLargerThumbnail: false,
        showAdAttribution: true
      };

      if (quoted) {
        const messageType = Object.keys(quoted)[0];
        const caption = quoted[messageType]?.caption || '';

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
            contextInfo: {
              mentionedJid: mentions,
              externalAdReply: externalReply
            }
          };

          if (messageType === 'imageMessage') {
            sendObj.image = stream;
            if (caption) sendObj.caption = caption;
          } else if (messageType === 'videoMessage') {
            sendObj.video = stream;
            if (caption) sendObj.caption = caption;
          } else if (messageType === 'audioMessage') {
            sendObj.audio = stream;
            sendObj.mimetype = quoted[messageType].mimetype;
          } else if (messageType === 'documentMessage') {
            sendObj.document = stream;
            sendObj.mimetype = quoted[messageType].mimetype;
            if (caption) sendObj.caption = caption;
          } else if (messageType === 'stickerMessage') {
            sendObj.sticker = stream;
          }

          return await sock.sendMessage(groupJid, sendObj, { quoted: msg });

        } else if (quoted.conversation || quoted.extendedTextMessage?.text) {
          const text = quoted.conversation || quoted.extendedTextMessage.text;
          return sock.sendMessage(groupJid, {
            text,
            mentions,
            contextInfo: { externalAdReply: externalReply }
          }, { quoted: msg });

        } else {
          return sock.sendMessage(groupJid, {
            text: '❌ لا يمكن إعادة إرسال هذا النوع من الرسائل.',
            contextInfo: { externalAdReply: externalReply }
          }, { quoted: msg });
        }

      } else {
        return sock.sendMessage(groupJid, {
          text: '𝑭𝑶𝑿 𝑩𝑶𝑻',
          mentions,
          contextInfo: { externalAdReply: externalReply }
        }, { quoted: msg });
      }

    } catch (err) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: `❌ حدث خطأ:\n${err.message || err.toString()}`
      }, { quoted: msg });
    }
  }
};