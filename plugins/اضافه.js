const fs = require('fs');
const path = require('path');

const pointsFile = path.join(__dirname, '../data/points.json');

// ✅ رقم المطور الوحيد
const developers = ['967715677073'];

function normalize(jid = '') {
  return jid.replace(/[^0-9]/g, '');
}

function loadPoints() {
  if (!fs.existsSync(pointsFile)) fs.writeFileSync(pointsFile, JSON.stringify({}));
  try {
    return JSON.parse(fs.readFileSync(pointsFile, 'utf8'));
  } catch (e) {
    return {};
  }
}

function savePoints(points) {
  fs.writeFileSync(pointsFile, JSON.stringify(points, null, 2));
}

module.exports = {
  command: ['نقاط', 'points'],
  description: 'نظام النقاط الخاص بالمطور',
  usage: '.نقاط [إضافة/عرض] [منشن]',
  category: 'admin',

  async execute(sock, msg, args) {
    const chatId = msg.key.remoteJid;
    const sender = normalize(msg.key.participant || msg.key.remoteJid);
    
    // التحقق من صلاحية المطور
    if (!developers.includes(sender)) {
      return sock.sendMessage(chatId, { text: '🚫 هذا الأمر مخصص للمطور فقط.' }, { quoted: msg });
    }

    const action = args[0];
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    let pointsData = loadPoints();

    // عرض النقاط
    if (action === 'عرض' || !action) {
      if (!mentioned) return sock.sendMessage(chatId, { text: '⚠️ منشن الشخص لعرض نقاطه.' }, { quoted: msg });
      const target = normalize(mentioned);
      const userPoints = pointsData[target] || 0;
      return sock.sendMessage(chatId, { text: `🎖️ العضو @${target} لديه ${userPoints} نقطة.`, mentions: [mentioned] }, { quoted: msg });
    }

    // إضافة النقاط
    if (action === 'إضافة') {
      if (!mentioned || !args[1]) return sock.sendMessage(chatId, { text: '⚠️ استخدم: .نقاط إضافة @منشن [العدد]' }, { quoted: msg });
      const target = normalize(mentioned);
      const amount = parseInt(args[1]);
      
      pointsData[target] = (pointsData[target] || 0) + amount;
      savePoints(pointsData);
      
      return sock.sendMessage(chatId, { text: `✅ تم إضافة ${amount} نقطة لـ @${target}.`, mentions: [mentioned] }, { quoted: msg });
    }
  }
};
