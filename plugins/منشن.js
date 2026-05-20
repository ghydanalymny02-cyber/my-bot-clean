// 📄 *mnnn.js* (جزء 1/1):

const { isElite, extractPureNumber } = require('../haykala/elite');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const fs = require('fs');
const { join } = require('path');

module.exports = {
  command: 'منشن',
  description: 'منشن مخفي',
  category: 'tools',

  async execute(sock, msg, args = []) {
    try {
      const senderJid = msg.key.participant || msg.participant || msg.key.remoteJid;
      const senderNumber = extractPureNumber(senderJid);
      const groupJid = msg.key.remoteJid;

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

      if (quoted && quotedMsgKey) {
        const mediaType = Object.keys(quoted)[0];

        
        const forwardMsg = {
          key: {
            remoteJid: groupJid,
            fromMe: false,
            id: quotedMsgKey,
            participant: quotedParticipant,
          },
          message: quoted
        };

        return sock.sendMessage(groupJid, {
          forward: forwardMsg,
          mentions
        });
      }

      
      
      let zarfText;
      try {
        const zarfData = JSON.parse(fs.readFileSync(join(process.cwd(), 'zarf.json')));
        if (!zarfData.messages?.mention) {
          return sock.sendMessage(groupJid, {
            text: '⚠️ لا توجد رسالة منشن محددة داخل zarf.json.'
          }, { quoted: msg });
        }
        zarfText = zarfData.messages.mention;
      } catch (err) {
        return sock.sendMessage(groupJid, {
          text: `⚠️ حدث خطأ في قراءة zarf.json:\n${err.message || err.toString()}`
        }, { quoted: msg });
      }

      return sock.sendMessage(groupJid, {
        text: zarfText,
        mentions
      }, { quoted: msg });

    } catch (err) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: `❌ حدث خطأ:\n${err.message || err.toString()}`
      }, { quoted: msg });
    }
  }
};