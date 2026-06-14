// حقوق ©️ مـــجـــهـــول
const fs = require('fs');
const path = require('path');

const pointsFile = path.join(__dirname, '../data/points.json');
const MAX_TAX = 5000;
const DEVELOPER_ID = '181020607422543@lid';

// تحميل نقاط المستخدمين من الملف
function loadPoints() {
  if (!fs.existsSync(pointsFile)) {
    fs.writeFileSync(pointsFile, JSON.stringify({}, null, 2));
  }
  return JSON.parse(fs.readFileSync(pointsFile));
}

// حفظ النقاط
function savePoints(data) {
  fs.writeFileSync(pointsFile, JSON.stringify(data, null, 2));
}

module.exports = {
  command: 'ضريبة',
  category: 'نظام',
  description: 'خصم نقاط من شخص (بالرد، المنشن أو الرقم يدويًا) - فقط للمطور',
  usage: '.ضريبة @منشن أو رد أو رقم 1000',

  async execute(sock, m) {
    try {
      const chatId = m.key.remoteJid;
      const senderId = m.key.participant || m.participant || m.key.remoteJid;

      if (senderId !== DEVELOPER_ID) {
        return await sock.sendMessage(chatId, {
          text: '🚫 هذا الأمر مخصص للمطور فقط.',
        }, { quoted: m });
      }

      const text = m.message?.conversation || m.message?.extendedTextMessage?.text || '';
      const args = text.trim().split(/\s+/);
      const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const quoted = m.message?.extendedTextMessage?.contextInfo?.participant || null;

      // استخراج الهدف (من الرد أو المنشن أو الرقم)
      let targetId = null;

      if (quoted) {
        targetId = quoted;
      } else if (mentioned.length > 0) {
        targetId = mentioned[0];
      } else if (args.length >= 3) {
        const raw = args[1].replace(/\D/g, '');
        if (raw) targetId = `${raw}@s.whatsapp.net`;
      }

      const amount = parseInt(args[args.length - 1]);

      if (!targetId || isNaN(amount) || amount < 0 || amount > MAX_TAX) {
        return await sock.sendMessage(chatId, {
          text: `❌ الصيغة غير صحيحة.\n✅ مثال:\n.ضريبة @منشن 1000\nأو .ضريبة 2123456789 1000\nأو رد على رسالة ثم .ضريبة 1000`,
        }, { quoted: m });
      }

      if (targetId === senderId) {
        return await sock.sendMessage(chatId, { text: '❌ لا يمكنك فرض ضريبة على نفسك.' });
      }

      const points = loadPoints();
      const targetPoints = points[targetId] || 0;

      if (targetPoints < amount) {
        return await sock.sendMessage(chatId, {
          text: `❌ المستخدم لا يملك نقاط كافية.\nرصيده: ${targetPoints}`,
        }, { quoted: m });
      }

      points[targetId] -= amount;
      savePoints(points);

      return await sock.sendMessage(chatId, {
        text: `💸 تم خصم *${amount}* نقطة من @${targetId.split('@')[0]} كضريبة.\nرصيده الحالي: ${points[targetId]}`,
        mentions: [targetId],
      }, { quoted: m });

    } catch (err) {
      console.error('🚫 Error in ضريبة command:', err);
    }
  }
};