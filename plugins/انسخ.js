const fs = require('fs');
const path = require('path');
const { eliteNumbers, extractPureNumber } = require('../haykala/elite');

const copyFile = path.join(__dirname, '..', 'data', 'eliteCopy.json');

if (!fs.existsSync(copyFile)) {
  fs.writeFileSync(copyFile, JSON.stringify({}), 'utf8');
}

module.exports = {
  command: 'انسخ',
  description: '📋 ينسخ رسالة معينة من الريبلای',
  category: 'DEVELOPER',
  usage: '.انسخ (اعمل ريبلاي على الرسالة)',

  async execute(sock, msg) {
    const senderJid = msg.key.participant || msg.participant || msg.key.remoteJid;
    const senderNumber = extractPureNumber(senderJid);
    const botJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';

    if (!eliteNumbers.includes(senderNumber) && senderJid !== botJid) {
      return sock.sendMessage(msg.key.remoteJid, { text: '🚫 الأمر ده خاص بالنخبة بس يا معلم.' }, { quoted: msg });
    }

    if (!msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
      return sock.sendMessage(msg.key.remoteJid, { text: '⚠️ لازم تعمل ريبلاي على الرسالة اللي عايز تنسخها!' }, { quoted: msg });
    }

    const quoted = msg.message.extendedTextMessage.contextInfo.quotedMessage;

    let toSave = {};
    if (quoted.conversation) {
      toSave = { text: quoted.conversation };
    } else if (quoted.extendedTextMessage?.text) {
      toSave = { text: quoted.extendedTextMessage.text };
    } else if (quoted.imageMessage) {
      toSave = { image: quoted.imageMessage };
    } else if (quoted.videoMessage) {
      toSave = { video: quoted.videoMessage };
    } else if (quoted.stickerMessage) {
      toSave = { sticker: quoted.stickerMessage };
    } else if (quoted.audioMessage) {
      toSave = { audio: quoted.audioMessage };
    }

    fs.writeFileSync(copyFile, JSON.stringify(toSave, null, 2), 'utf8');

    await sock.sendMessage(msg.key.remoteJid, { text: '✅ تم نسخ الرسالة بنجاح يا زعيم النخبة.' }, { quoted: msg });
  }
};