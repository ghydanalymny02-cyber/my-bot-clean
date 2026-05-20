const fs = require('fs');
const path = require('path');
const { eliteNumbers } = require('../haykala/elite.js');

// دالة حساب المسافة بين الكلمات
function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
  matrix[0] = Array.from({ length: a.length + 1 }, (_, j) => j);

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) matrix[i][j] = matrix[i - 1][j - 1];
      else matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
    }
  }
  return matrix[b.length][a.length];
}

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
  command: ['استرجع'],
  description: '♻️ استرجاع ملف (أو كل الملفات) من التراش إلى البلوجنز.',
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
    const pluginsDir = path.resolve('./plugins');

    if (!fs.existsSync(trashDir)) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '🗑️ مجلد التراش مش موجود أصلاً!',
      }, { quoted: msg });
    }

    const trashFiles = fs.readdirSync(trashDir).filter(f => f.endsWith('.js'));
    const fileNames = trashFiles.map(f => f.replace('.js', ''));

    const fullText = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
    const commandName = fullText.split(' ')[0]?.toLowerCase();
    const inputText = fullText.slice(commandName.length).trim().toLowerCase();

    if (!inputText) {
  if (fileNames.length === 0) {
    return await sock.sendMessage(msg.key.remoteJid, {
      text: '🗑️ مفيش ملفات في التراش علشان تسترجعها.',
    }, { quoted: msg });
  }

  const list = fileNames.map((v, i) => `${(i + 1).toString().padEnd(3)}. ${v}`).join('\n');

  return await sock.sendMessage(msg.key.remoteJid, {
    text: `
♻️ *ملفات التراش المتاحة للاسترجاع:*
━━━━━━━━━━━━━━━━
🔢 الإجمالي: ${fileNames.length} ملف
━━━━━━━━━━━━━━━━
${list}
━━━━━━━━━━━━━━━━
✍️ اكتب رقم أو اسم الملف علشان تسترجعه، أو اكتب "كلهم" لو عايز ترجّع الكل.
    `.trim()
  }, { quoted: msg });
}

    const restoreFile = async (fileName) => {
      const src = path.join(trashDir, `${fileName}.js`);
      const dest = path.join(pluginsDir, `${fileName}.js`);

      if (!fs.existsSync(src)) return `❌ الملف ${fileName} مش موجود في التراش.`;

      fs.renameSync(src, dest);
      return `✅ تم استرجاع: *${fileName}*`;
    };

    if (inputText === 'كلهم') {
      if (fileNames.length === 0) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: '🗑️ مفيش ملفات في التراش علشان تسترجعها.',
        }, { quoted: msg });
      }

      const results = [];
      for (const name of fileNames) {
        results.push(await restoreFile(name));
      }

      return await sock.sendMessage(msg.key.remoteJid, {
        text: `♻️ *تم استرجاع كل الملفات:*\n\n${results.join('\n')}`,
      }, { quoted: msg });
    }

    let selectedFile = '';
    if (/^\d+$/.test(inputText)) {
      const index = parseInt(inputText) - 1;
      if (index >= 0 && index < fileNames.length) {
        selectedFile = fileNames[index];
      } else {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: `⚠️ الرقم خارج النطاق! اختر من 1 لـ ${fileNames.length}`,
        }, { quoted: msg });
      }
    } else {
      if (fileNames.includes(inputText)) {
        selectedFile = inputText;
      } else {
        const closest = findClosestMatch(inputText, fileNames);
        let reply = `⚠️ الملف "${inputText}" مش موجود.`;
        if (closest) reply += `\n🔍 ممكن تقصد: *${closest}*`;
        return await sock.sendMessage(msg.key.remoteJid, { text: reply }, { quoted: msg });
      }
    }

    const result = await restoreFile(selectedFile);
    return await sock.sendMessage(msg.key.remoteJid, { text: result }, { quoted: msg });
  }
};