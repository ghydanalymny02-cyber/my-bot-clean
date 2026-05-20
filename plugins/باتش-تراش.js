const fs = require('fs');
const path = require('path');
const { eliteNumbers } = require('../haykala/elite.js');

// دالة لحساب المسافة بين الكلمات (Levenshtein Distance)
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
  command: ['باتش-تراش'],
  description: '🗃️ عرض ملفات مجلد التراش أو استعراض ملف معين.',
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

    const trashFiles = fs.readdirSync(trashDir)
      .filter(file => file.endsWith('.js'));
    const fileNames = trashFiles.map(v => v.replace('.js', ''));

    const fullText =
      msg.message?.conversation ||
      msg.message?.extendedTextMessage?.text ||
      '';
    const commandName = fullText.split(' ')[0]?.toLowerCase();
    const inputText = fullText.slice(commandName.length).trim();

    // لو المستخدم مكتبش حاجة
    if (!inputText) {
      if (fileNames.length === 0) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: '🗃️ مجلد التراش فارغ حالياً.',
        }, { quoted: msg });
      }

      const list = fileNames.map((v, i) => `${(i + 1).toString().padEnd(3)}. ${v}`).join('\n');

      return await sock.sendMessage(msg.key.remoteJid, {
        text: `
🗃️ *ملفات التراش المتاحة:*
━━━━━━━━━━━━━━━━
🔢 الإجمالي: ${fileNames.length} ملف
━━━━━━━━━━━━━━━━
${list}
━━━━━━━━━━━━━━━━
✍️ اكتب رقم أو اسم الملف لاستعراضه.
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
          text: `⚠️ الرقم غير صحيح! اختر رقم من 1 إلى ${fileNames.length}`,
        }, { quoted: msg });
      }
    } else {
      if (fileNames.includes(inputText)) {
        selectedFile = inputText;
      } else {
        const closest = findClosestMatch(inputText, fileNames);
        let reply = `⚠️ الملف "${inputText}" غير موجود.`;
        if (closest) reply += `\n🔍 ربما تقصد: *${closest}*`;
        return await sock.sendMessage(msg.key.remoteJid, { text: reply }, { quoted: msg });
      }
    }

    const filePath = path.join(trashDir, `${selectedFile}.js`);
    try {
      const content = fs.readFileSync(filePath, 'utf-8');

      // إرسال الملف كمستند
      await sock.sendMessage(msg.key.remoteJid, {
        document: fs.readFileSync(filePath),
        mimetype: 'application/javascript',
        fileName: `${selectedFile}.js`
      }, { quoted: msg });

      // إرسال المحتوى مقسّم لو طويل
      const chunks = content.match(/[\s\S]{1,4000}/g) || [];
      for (let i = 0; i < chunks.length; i++) {
        await sock.sendMessage(msg.key.remoteJid, {
          text: `📄 *${selectedFile}.js* (جزء ${i + 1}/${chunks.length}):\n\n${chunks[i]}`
        }, { quoted: msg });
      }

    } catch (err) {
      console.error(err);
      return await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ حصل خطأ أثناء قراءة الملف: ${err.message}`,
      }, { quoted: msg });
    }
  }
};