const { getUniqueKicked } = require('../haykala/dataUtils');
const { extractPureNumber } = require('../haykala/elite');

module.exports = {
  command: 'عدد',
  description: 'نقاطك',
  category: 'FOX',
  usage: '.عدد',

  async execute(sock, msg) {
    

    const kickedSet = getUniqueKicked();
    const total = kickedSet.size;

    const levels = [
      { threshold: 0, emoji: '🔻' },
      { threshold: 50, emoji: '🔵' },
      { threshold: 100, emoji: '🟠' },
      { threshold: 200, emoji: '🟢' },
      { threshold: 400, emoji: '💲' },
      { threshold: 800, emoji: '🟣' },
      { threshold: 1600, emoji: '🟤' },
      { threshold: 3200, emoji: '🔴' },
      { threshold: 6400, emoji: '⚫' },
      { threshold: 12800, emoji: '⚪' },
      { threshold: 25600, emoji: '🔆' },
      { threshold: 51200, emoji: '⚜️' },
      { threshold: 102400, emoji: '🔱' },
      { threshold: 204800, emoji: '✴️' },
      { threshold: 409600, emoji: '☢️' },
      { threshold: 819200, emoji: '💠' },
      { threshold: 1638400, emoji: '♾️' }
    ];

    let level = 0;
    let emoji = '🔶';

    for (let i = levels.length - 1; i >= 0; i--) {
      if (total >= levels[i].threshold) {
        level = i;
        emoji = levels[i].emoji;
        break;
      }
    }

    const message = `المستوى : ${level} ${emoji}\nعدد التصفية : ${total} 🔹`;

    await sock.sendMessage(msg.key.remoteJid, {
      text: message
    }, { quoted: msg });
  }
};