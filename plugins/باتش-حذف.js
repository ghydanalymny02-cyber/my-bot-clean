const fs = require('fs');
const path = require('path');
const { eliteNumbers } = require('../haykala/elite.js');

// دالة نقل الملف إلى مجلد التراش بدل حذفه
function moveToTrash(fileName) {
  const sourcePath = path.resolve('./plugins', fileName);
  const trashDir = path.resolve('./trash');
  const destPath = path.join(trashDir, fileName);

  if (!fs.existsSync(trashDir)) fs.mkdirSync(trashDir);

  if (fs.existsSync(sourcePath)) {
    fs.renameSync(sourcePath, destPath);
    return true;
  }
  return false;
}

module.exports = {
  command: ['باتش-حذف'],
  description: '🗑️ نقل ملف من مجلد الإضافات إلى مجلد التراش.',
  category: 'DEVELOPER',

  async execute(sock, msg) {
    const sender = msg.key.participant || msg.key.remoteJid;
    const senderNumber = sender.split('@')[0];
    if (!eliteNumbers.includes(senderNumber)) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ هذا الأمر مخصص للنخبة فقط.',
      }, { quoted: msg });
    }

    const pluginsDir = path.resolve('./plugins');
    const pluginFiles = fs.readdirSync(pluginsDir)
      .filter(file => file.endsWith('.js') && !file.startsWith('_'));

    const pluginNames = pluginFiles.map(v => v.replace('.js', ''));

    const fullText =
      msg.message?.conversation ||
      msg.message?.extendedTextMessage?.text ||
      '';

    const commandName = fullText.split(' ')[0]?.toLowerCase();
    const inputText = fullText.slice(commandName.length).trim();

    if (!inputText) {
      const pluginList = pluginNames.map((v, index) =>
        `${(index + 1).toString().padEnd(3)}. ${v}`
      ).join('\n');

      return await sock.sendMessage(msg.key.remoteJid, {
        text: `
🗑️ *قائمة إضافات البوت:*
━━━━━━━━━━━━━━
🔢 الإجمالي: ${pluginNames.length} ملف
━━━━━━━━━━━━━━
${pluginList}
━━━━━━━━━━━━━━
✍️ أرسل رقم أو اسم الإضافة لحذفها (نقلها للتراش).
`.trim()
      }, { quoted: msg });
    }

    let selectedPlugin = '';

    if (/^\d+$/.test(inputText)) {
      const index = parseInt(inputText) - 1;
      if (index >= 0 && index < pluginNames.length) {
        selectedPlugin = pluginNames[index];
      } else {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: `⚠️ الرقم غير صحيح! اختر رقم بين 1 و ${pluginNames.length}`,
        }, { quoted: msg });
      }
    } else {
      if (pluginNames.includes(inputText)) {
        selectedPlugin = inputText;
      } else {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: `❌ الملف "${inputText}" غير موجود ضمن الإضافات.`,
        }, { quoted: msg });
      }
    }

    const moved = moveToTrash(`${selectedPlugin}.js`);
    if (moved) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: `✅ تم نقل *${selectedPlugin}.js* إلى مجلد التراش.`,
      }, { quoted: msg });
    } else {
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ فشل في نقل *${selectedPlugin}.js* – الملف غير موجود.`,
      }, { quoted: msg });
    }
  }
};