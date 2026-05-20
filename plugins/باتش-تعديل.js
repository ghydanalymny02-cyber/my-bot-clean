const fs = require('fs');
const path = require('path');
const { eliteNumbers } = require('../haykala/elite.js');

// دالة حساب المسافة بين الكلمات
function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

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

// إيجاد أقرب اسم
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
  command: ['باتش-تعديل'],
  description: '🛠️ تعديل ملف من مجلد الإضافات بالاسم أو الرقم أو عبر ريبلاي على الكود.',
  category: 'DEVELOPER',

  async execute(sock, msg) {
    const sender = msg.key.participant || msg.key.remoteJid;
    const senderNumber = sender.split('@')[0];
    if (!eliteNumbers.includes(senderNumber)) {
      return await sock.sendMessage(msg.key.remoteJid, { text: '❌ هذا الأمر مخصص للنخبة فقط.' }, { quoted: msg });
    }

    const pluginsDir = path.resolve('./plugins');
    const pluginFiles = fs.readdirSync(pluginsDir)
      .filter(file => file.endsWith('.js') && !file.startsWith('_'));
    const pluginNames = pluginFiles.map(v => v.replace('.js', ''));

    const fullText = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
    const commandName = fullText.split(' ')[0]?.toLowerCase();
    const inputText = fullText.slice(commandName.length).trim();

    // لو مفيش اسم ملف وكود، أو مفيش ريبلاي
    if (!inputText && !msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
      const pluginList = pluginNames.map((v, index) =>
        `${(index + 1).toString().padEnd(3)}. ${v}`
      ).join('\n');

      return await sock.sendMessage(msg.key.remoteJid, {
        text: `
🛠️ لتعديل ملف:
.باتش-تعديل رقم/اسم <الكود الجديد>
أو اعمل ريبلاي على الكود مع كتابة رقم/اسم الملف.

📁 الملفات:
━━━━━━━━━━━━━━━━
🔢 الإجمالي: ${pluginNames.length} ملف
━━━━━━━━━━━━━━━━
${pluginList}
━━━━━━━━━━━━━━━━
✍️ أرسل رقم أو اسم ثم الكود الجديد أو اعمل ريبلاي.
`.trim()
      }, { quoted: msg });
    }

    let fileIdentifier = '';
    let newData = '';

    if (inputText.includes(' ')) {
      // فيه اسم ملف وكود في نفس الرسالة
      fileIdentifier = inputText.split(' ')[0];
      newData = inputText.slice(fileIdentifier.length).trim();
    } else {
      // فيه اسم ملف بس، والكود من الريبلاي
      fileIdentifier = inputText || '';
      if (msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
        const quoted = msg.message.extendedTextMessage.contextInfo.quotedMessage;
        newData =
          quoted.conversation ||
          quoted.extendedTextMessage?.text ||
          quoted.documentMessage?.caption ||
          '';
      }
    }

    if (!fileIdentifier) {
      return await sock.sendMessage(msg.key.remoteJid, { text: `⚠️ لازم تحدد اسم الملف أو رقمه.` }, { quoted: msg });
    }
    if (!newData) {
      return await sock.sendMessage(msg.key.remoteJid, { text: `⚠️ مفيش كود للتعديل.` }, { quoted: msg });
    }

    // تحديد الملف
    let selectedPlugin = '';
    if (/^\d+$/.test(fileIdentifier)) {
      const index = parseInt(fileIdentifier) - 1;
      if (index >= 0 && index < pluginNames.length) {
        selectedPlugin = pluginNames[index];
      } else {
        return await sock.sendMessage(msg.key.remoteJid, { text: `⚠️ الرقم غير صحيح!` }, { quoted: msg });
      }
    } else {
      if (pluginNames.includes(fileIdentifier)) {
        selectedPlugin = fileIdentifier;
      } else {
        const closestMatch = findClosestMatch(fileIdentifier, pluginNames);
        if (closestMatch) {
          return await sock.sendMessage(msg.key.remoteJid, {
            text: `⚠️ الملف "${fileIdentifier}" غير موجود!\n💡 ربما تقصد: *${closestMatch}*`
          }, { quoted: msg });
        } else {
          return await sock.sendMessage(msg.key.remoteJid, { text: `⚠️ الملف "${fileIdentifier}" غير موجود.` }, { quoted: msg });
        }
      }
    }

    const filePath = path.join(pluginsDir, `${selectedPlugin}.js`);

    try {
      fs.writeFileSync(filePath, newData, 'utf-8');
      return await sock.sendMessage(msg.key.remoteJid, { text: `✅ تم تعديل الملف *${selectedPlugin}.js* بنجاح.` }, { quoted: msg });
    } catch (err) {
      console.error(err);
      return await sock.sendMessage(msg.key.remoteJid, { text: `❌ فشل تعديل الملف: ${err.message}` }, { quoted: msg });
    }
  }
};