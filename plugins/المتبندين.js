const fs = require('fs');
const path = require('path');
const { eliteNumbers, extractPureNumber } = require('../haykala/elite');

const bannedFile = path.join(__dirname, '..', 'data', 'banned.json');

function loadBanned() {
  return JSON.parse(fs.readFileSync(bannedFile));
}

module.exports = {
  command: 'المتبندين',
  description: '📋 عرض قائمة الأرقام المحظورة',
  category: 'DEVELOPER',

  async execute(sock, msg) {
    const sender = msg.key.participant || msg.key.remoteJid;
    const senderNumber = extractPureNumber(sender);

    if (!eliteNumbers.includes(senderNumber)) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: '🚫 الأمر ده للنخبة بس يا زعيم 😎',
      }, { quoted: msg });
    }

    const banned = loadBanned();

    if (banned.length === 0) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: '📭 مفيش ولا رقم محظور حاليًا، كله تمام ✨',
      }, { quoted: msg });
    }

    const list = banned.map((num, i) => `*${i + 1}.* ${num}`).join('\n');

    await sock.sendMessage(msg.key.remoteJid, {
      text: `📛 *قائمة المتبندين:*\n\n${list}`,
    }, { quoted: msg });
  }
};