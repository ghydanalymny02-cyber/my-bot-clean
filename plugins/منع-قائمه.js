const fs = require('fs');
const path = require('path');
const bannedFile = path.join(__dirname, '../data/banedCodes.json');

module.exports = {
  command: 'منع-قائمه',
  description: '📋 عرض الرموز الممنوعة',
  category: 'DEVELOPER',

  async execute(sock, msg, args) {
    const banned = JSON.parse(fs.readFileSync(bannedFile));
    const list = banned.length ? banned.join('\n') : '🚫 لا يوجد رموز ممنوعة حاليًا.';

    await sock.sendMessage(msg.key.remoteJid, {
      text: `📋 قائمة الرموز المحظورة:\n\n${list}`,
    }, { quoted: msg });
  }
};