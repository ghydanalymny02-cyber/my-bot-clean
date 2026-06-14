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
      matrix[i][j] = (b[i - 1] === a[j - 1])
        ? matrix[i - 1][j - 1]
        : Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
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
  command: ['باتش-اسم'],
  description: '✏️ تعديل اسم ملف في مجلد الإضافات.',
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
    const args = fullText.slice(commandName.length).trim().split(/\s+/);

    if (args.length < 2) {
      const pluginList = pluginNames.map((v, i) => `${(i + 1).toString().padEnd(3)}. ${v}`).join('\n');
      return await sock.sendMessage(msg.key.remoteJid, {
        text: `
📁 قائمة ملفات البوت
━━━━━━━━━━━━━━━━
🔢 الإجمالي: ${pluginNames.length} ملف
━━━━━━━━━━━━━━━━
${pluginList}
━━━━━━━━━━━━━━━━
✍️ الاستخدام:
.باتش-اسم 1 اسم_جديد
.باتش-اسم قديم جديد
        `.trim()
      }, { quoted: msg });
    }

    let oldName = '';
    const newName = args[1].endsWith('.js') ? args[1].replace('.js', '') : args[1];

    // لو رقم
    if (/^\d+$/.test(args[0])) {
      const index = parseInt(args[0]) - 1;
      if (index >= 0 && index < pluginNames.length) {
        oldName = pluginNames[index];
      } else {
        return await sock.sendMessage(msg.key.remoteJid, { 
          text: `⚠️ الرقم غير صحيح! اختر بين 1 و ${pluginNames.length}`
        }, { quoted: msg });
      }
    } 
    // لو نص
    else {
      if (pluginNames.includes(args[0])) {
        oldName = args[0];
      } else {
        const closest = findClosestMatch(args[0], pluginNames);
        if (closest) {
          return await sock.sendMessage(msg.key.remoteJid, {
            text: `⚠️ الملف "${args[0]}" غير موجود!\n💡 ربما تقصد: *${closest}*`
          }, { quoted: msg });
        } else {
          return await sock.sendMessage(msg.key.remoteJid, {
            text: `⚠️ الملف "${args[0]}" غير موجود!`
          }, { quoted: msg });
        }
      }
    }

    const oldPath = path.join(pluginsDir, `${oldName}.js`);
    const newPath = path.join(pluginsDir, `${newName}.js`);

    if (fs.existsSync(newPath)) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: `⚠️ الملف "${newName}.js" موجود بالفعل!`
      }, { quoted: msg });
    }

    try {
      fs.renameSync(oldPath, newPath);
      await sock.sendMessage(msg.key.remoteJid, {
        text: `✅ تم تغيير اسم الملف من *${oldName}.js* إلى *${newName}.js*`
      }, { quoted: msg });
    } catch (err) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ فشل تعديل الاسم: ${err.message}`
      }, { quoted: msg });
    }
  }
};