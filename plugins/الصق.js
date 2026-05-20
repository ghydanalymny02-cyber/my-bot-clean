const fs = require('fs');
const path = require('path');
const { eliteNumbers, extractPureNumber } = require('../haykala/elite');

const copyFile = path.join(__dirname, '..', 'data', 'eliteCopy.json');

module.exports = {
  command: 'الصق',
  description: '📌 يلصق الرسالة اللي اتعمل لها نسخ قبل كدا',
  category: 'DEVELOPER',
  usage: '.الصق',

  async execute(sock, msg) {
    const senderJid = msg.key.participant || msg.participant || msg.key.remoteJid;
    const senderNumber = extractPureNumber(senderJid);
    const botJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';

    if (!eliteNumbers.includes(senderNumber) && senderJid !== botJid) {
      return sock.sendMessage(msg.key.remoteJid, { text: '🚫 الأمر ده خاص بالنخبة بس يا معلم.' }, { quoted: msg });
    }

    if (!fs.existsSync(copyFile)) {
      return sock.sendMessage(msg.key.remoteJid, { text: '⚠️ مفيش رسالة متخزنة حاليا.' }, { quoted: msg });
    }

    const copyData = JSON.parse(fs.readFileSync(copyFile, 'utf8'));

    if (!copyData || Object.keys(copyData).length === 0) {
      return sock.sendMessage(msg.key.remoteJid, { text: '⚠️ مفيش رسالة متخزنة حاليا.' }, { quoted: msg });
    }

    try {
      await sock.sendMessage(msg.key.remoteJid, copyData, { quoted: msg });
    } catch (e) {
      console.error('❌ خطأ أثناء اللصق:', e);
      await sock.sendMessage(msg.key.remoteJid, { text: '❌ حصل خطأ أثناء محاولة لصق الرسالة.' }, { quoted: msg });
    }
  }
};