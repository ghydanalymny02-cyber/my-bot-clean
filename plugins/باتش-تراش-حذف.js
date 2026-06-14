const fs = require('fs');
const path = require('path');
const { eliteNumbers } = require('../haykala/elite.js');

// دالة حساب المسافة بين الكلمات
function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// دالة لإيجاد أقرب اسم
function findClosestMatch(input, options, maxDistance = 3) {
  let closest = null;
  let minDistance = Infinity;

  for (const option of options) {
    const distance = levenshteinDistance(input.toLowerCase(), option.toLowerCase());
    if (distance < minDistance && distance <= maxDistance) {
      minDistance = distance;
      closest = option;
    }
  }

  return closest;
}

module.exports = {
  command: ['باتش-تراش-حذف'],
  description: '🧹 حذف ملف أو كل الملفات من مجلد التراش.',
  category: 'DEVELOPER',

  async execute(sock, msg) {
    const sender = msg.key.participant || msg.key.remoteJid;
    const senderNumber = sender.split('@')[0];
    if (!eliteNumbers.includes(senderNumber)) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ هذا الأمر مخصص للنخبة فقط.',
      }, { quoted: msg });
    }

    const trashDir = path.resolve('./trash');
    if (!fs.existsSync(trashDir)) fs.mkdirSync(trashDir);

    const trashFiles = fs.readdirSync(trashDir).filter(file => file.endsWith('.js'));
    const fileNames = trashFiles.map(v => v.replace('.js', ''));

    const fullText =
      msg.message?.conversation ||
      msg.message?.extendedTextMessage?.text ||
      '';

    const commandName = fullText.split(' ')[0]?.toLowerCase();
    const inputText = fullText.slice(commandName.length).trim();

    // لو كتب كلهم
    if (inputText === 'كلهم') {
      if (fileNames.length === 0) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: '🗑️ مفيش ملفات في التراش.',
        }, { quoted: msg });
      }

      for (const file of trashFiles) {
        const filePath = path.join(trashDir, file);
        fs.unlinkSync(filePath);
      }

      return await sock.sendMessage(msg.key.remoteJid, {
        text: `🧹 تم حذف *جميع ملفات التراش* (${fileNames.length} ملف).`,
      }, { quoted: msg });
    }

    // لو المستخدم مكتبش حاجة
    if (!inputText) {
      const list = fileNames.map((v, i) => `${i + 1}. ${v}`).join('\n');
      return await sock.sendMessage(msg.key.remoteJid, {
        text: `
🗃️ *قائمة ملفات التراش:*
━━━━━━━━━━━━━━━━
🔢 الإجمالي: ${fileNames.length} ملف
━━━━━━━━━━━━━━━━
${list}
━━━━━━━━━━━━━━━━
✍️ اكتب رقم، اسم الملف، أو كلمة "كلهم" عشان تحذف من التراش.
مثال: .باتش-تراش-حذف 2
        `.trim()
      }, { quoted: msg });
    }

    let selectedFile = '';

    if (/^\d+$/.test(inputText)) {
      const index = parseInt(inputText) - 1;
      if (index >= 0 && index < fileNames.length) {
        selectedFile = fileNames[index];
      } else {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: `⚠️ الرقم خارج النطاق! اختر رقم من 1 إلى ${fileNames.length}`,
        }, { quoted: msg });
      }
    } else {
      if (fileNames.includes(inputText)) {
        selectedFile = inputText;
      } else {
        const closestMatch = findClosestMatch(inputText, fileNames);
        let msgText = `⚠️ الملف "${inputText}" غير موجود في التراش.`;
        if (closestMatch) msgText += `\n🔎 ربما تقصد: *${closestMatch}*`;
        return await sock.sendMessage(msg.key.remoteJid, { text: msgText }, { quoted: msg });
      }
    }

    const filePath = path.join(trashDir, `${selectedFile}.js`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return await sock.sendMessage(msg.key.remoteJid, {
        text: `🧹 تم حذف الملف *${selectedFile}.js* من التراش.`,
      }, { quoted: msg });
    } else {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ الملف *${selectedFile}.js* مش موجود في مجلد التراش.`,
      }, { quoted: msg });
    }
  }
};