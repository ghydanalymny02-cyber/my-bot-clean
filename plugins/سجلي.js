const fs = require('fs');
const path = require('path');

const dbFile = path.resolve(__dirname, '../data/members.json');

function loadDB() {
  if (!fs.existsSync(dbFile)) return {};
  return JSON.parse(fs.readFileSync(dbFile));
}

module.exports = {
  command: ['سجلي'],
  description: 'يعرض كل بياناتك الشخصية اللي سجلتها.',
  category: 'tools',
  async execute(sock, msg) {
    const sender = (msg.key.participant || msg.key.remoteJid).split('@')[0];
    const db = loadDB();
    const data = db[sender];

    if (!data) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: '❗️مش لاقي بيانات ليك، استخدم .سجل لتسجيل بياناتك.',
      }, { quoted: msg });
    }

    let info = `🗂️ *بياناتك المسجلة:*\n\n`;

    if (data.id) info += `🆔 رقم البطاقة: ${data.id}\n`;
    if (data.name) info += `👤 الاسم: ${data.name}\n`;
    if (data.number) info += `📱 رقمك: ${data.number}\n`;
    if (data.joinedAt) info += `📆 سجلت يوم: ${data.joinedAt}\n`;
    if (data.nickname) info += `🏷️ اللقب: ${data.nickname}\n`;
    if (data.age) info += `🎂 العمر: ${data.age}\n`;
    if (data.gender) info += `⚧️ الجنس: ${data.gender}\n`;
    if (data.country) info += `🌍 الدولة: ${data.country}\n`;
    if (data.anime) info += `🎌 أنمي مفضل: ${data.anime}\n`;
    info += `✅ جاهز؟: ${data.ready ? 'نعم' : 'لا'}\n`;

    if (data.image && fs.existsSync(data.image)) {
      const imageBuffer = fs.readFileSync(data.image);
      return await sock.sendMessage(msg.key.remoteJid, {
        image: imageBuffer,
        caption: info,
      }, { quoted: msg });
    } else {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: info,
      }, { quoted: msg });
    }
  }
};