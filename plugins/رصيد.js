const fs = require('fs');
const path = require('path');
const pointsFile = path.join(__dirname, '../data/points.json');

function loadPoints() {
  if (!fs.existsSync(pointsFile)) fs.writeFileSync(pointsFile, '{}');
  return JSON.parse(fs.readFileSync(pointsFile));
}

function getRank(score) {
  if (score >= 10000) return '🏆 سيد الأساطير';
  if (score >= 5000) return '👑 ملك النقاط';
  if (score >= 2000) return '🔥 أسطورة ملحمية';
  if (score >= 1000) return '🥇 بطل خارق';
  if (score >= 600)  return '🥈 مقاتل محترف';
  if (score >= 300)  return '🥉 لاعب قوي';
  if (score >= 150)  return '🏅 واعد';
  if (score >= 50)   return '🎖️ مبتدئ جيد';
  return '🌱 مبتدئ جداً';
}

module.exports = {
  command: 'رصيد',
  description: '📊 لمعرفة رصيد شخص بالمنشن',
  usage: '.رصيد @العضو',
  category: 'INFO',

  async execute(sock, msg) {
    const mention = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (!mention) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: '❌ منشن شخص لمعرفة رصيده.\nمثال:\n.رصيد @العضو'
      }, { quoted: msg });
    }

    const targetId = mention.replace(/[^0-9]/g, '');
    const points = loadPoints();
    const score = points[targetId] || 0;
    const rank = getRank(score);

    const text = `╭───❖ 『 *📊 رصيد العضو* 』❖───╮

👤 الرقم: *${targetId}*
💰 النقاط: *${score}*
🏆 التصنيف: ${rank}

╰─⟡  مـــجـــهـــول ⟡─╯`;

    await sock.sendMessage(msg.key.remoteJid, {
      text,
      mentions: [mention]
    }, { quoted: msg });
  }
};