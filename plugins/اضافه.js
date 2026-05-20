const fs = require('fs');
const path = require('path');

const pointsFile = path.join(__dirname, '../data/points.json');

// ✅ أرقام المطورين
const developers = [
  '963996097873',
  '963996097873',
  '178817339498583',
  '178817339498583'
];

function loadPoints() {
  if (!fs.existsSync(pointsFile)) fs.writeFileSync(pointsFile, '{}');
  return JSON.parse(fs.readFileSync(pointsFile));
}

function savePoints(points) {
  fs.writeFileSync(pointsFile, JSON.stringify(points, null, 2));
}

module.exports = {
  command: 'اضافه',
  description: '➕ إضافة نقاط لنفسك أو لشخص آخر (للمطور فقط)',
  usage: '.اضافه 1000 @العضو',
  category: 'DEVELOPER',

  async execute(sock, msg, args) {
    const sender = msg.key.participant || msg.key.remoteJid;
    const senderId = sender.split('@')[0];

    if (!developers.includes(senderId)) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: '🚫 هذا الأمر مخصص للمطور فقط!',
      }, { quoted: msg });
    }

    const text = msg.message?.extendedTextMessage?.text || msg.message?.conversation || msg.body || '';
    const numberMatch = text.match(/\.?اضافه\s+(\d+)/i);

    if (!numberMatch) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: '❌ يرجى كتابة عدد النقاط. مثال:\n\n.اضافة 1000 @العضو',
      }, { quoted: msg });
    }

    const amount = parseInt(numberMatch[1]);
    const mention = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    const targetId = mention ? mention.split('@')[0] : senderId;

    const points = loadPoints();
    points[targetId] = (points[targetId] || 0) + amount;
    savePoints(points);

    const confirmationText = mention
      ? `╭───❖ 『 *تمت الإضافة بنجاح* 』❖───╮\n\n🎯 تمت إضافة *${amount}* نقطة إلى:\n👤 <@${targetId}>\n📞 الرقم: *${targetId}*\n\n╰─⟡ *نفذها المطور حرب* ⟡─╯`
      : `╭───❖ 『 *تمت الإضافة لك* 』❖───╮\n\n🎯 أضفت لنفسك *${amount}* نقطة\n📞 رقمك: *${targetId}*\n\n╰─⟡ *استمر يا بطل!* ⟡─╯`;

    await sock.sendMessage(msg.key.remoteJid, {
      text: confirmationText,
      mentions: mention ? [mention] : [],
    }, { quoted: msg });
  }
};