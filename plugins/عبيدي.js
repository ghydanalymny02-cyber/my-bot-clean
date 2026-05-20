const fs = require('fs');
const path = require('path');

// مسار قاعدة بيانات العبيد
const dbDir = path.join(__dirname, '..', 'db');
const dbFile = path.join(dbDir, 'slaves.json');

// التأكد من وجود المجلد والملف
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, '{}');

// قراءة العبيد
function loadSlaves() {
  try {
    return JSON.parse(fs.readFileSync(dbFile));
  } catch {
    return {};
  }
}

// إيموجيات عشوائية للعرض
const slaveEmojis = ['🧎‍♂️', '🔗', '🪢', '⛓️', '🪤', '🦶'];
function getRandomEmoji() {
  return slaveEmojis[Math.floor(Math.random() * slaveEmojis.length)];
}

module.exports = {
  command: ['عبيدي'],
  description: 'عرض قائمة كل العبيد فورًا',
  usage: '.عبيدي',
  category: 'ترفيه',

  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;

    const slaves = loadSlaves();
    const entries = Object.entries(slaves);

    let totalSlaves = 0;
    for (const [_, slavesList] of entries) {
      totalSlaves += Array.isArray(slavesList) ? slavesList.length : 0;
    }

    if (totalSlaves === 0) {
      await sock.sendMessage(chatId, {
        text: '❌ لا يوجد عبيد مسجلين حالياً.',
      }, { quoted: msg });
      return;
    }

    const mentioned = new Set();
    let text = `🔗 *قائمة العبيد المسجلين* 🔗\n\nعدد العبيد: ${totalSlaves}\n\n`;

    for (const [ownerJid, slavesList] of entries) {
      if (!Array.isArray(slavesList)) continue;
      for (const slaveJid of slavesList) {
        if (!slaveJid || !slaveJid.includes('@')) continue;

        const emoji = getRandomEmoji();
        text += `${emoji} *@${slaveJid.split('@')[0]}* 👈 تابع *@${ownerJid.split('@')[0]}*\n`;
        text += '──────────────────\n';
        mentioned.add(slaveJid);
        mentioned.add(ownerJid);
      }
    }

    text += `\n🕯️ وُلدوا للقيودِ فخانَهم ظلُّ الحنينِ، فساروا صامتين...`;

    await sock.sendMessage(chatId, {
      text,
      mentions: Array.from(mentioned),
    }, { quoted: msg });
  }
};