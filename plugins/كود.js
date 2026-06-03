const fs = require('fs');
const path = require('path');
const { isElite, extractPureNumber } = require('../haykala/elite');

module.exports = {
  command: 'كود',
  category: 'tools',
  description: 'يعرض محتوى ملف بلوجين من مجلد plugins (للنخبة فقط)',

  async execute(sock, msg, args = []) {
    try {
      const jid = msg.key.remoteJid;
      const senderJid = msg.key.participant || msg.participant || jid;
      const senderNumber = extractPureNumber(senderJid);

      if (!isElite(senderNumber)) {
        return sock.sendMessage(jid, { text: '🚫 هذا الأمر مخصص للنخبة فقط.' }, { quoted: msg });
      }

      const pluginsFolder = path.resolve(process.cwd(), 'plugins');
      const allFiles = fs.readdirSync(pluginsFolder).filter(f => f.endsWith('.js'));

      // إذا ما في args، جرب ناخذ اسم الملف من نص الرسالة بعد الأمر مباشرة
      let pluginName = args.join(' ').trim();

      // إذا ما في args لكن الرسالة رد (Reply) و النص بعد الأمر فارغ
      if (!pluginName) {
        // نحاول استخراج النص الكامل بعد الأمر من نص الرسالة
        // فرضاً نص الرسالة هو: ".كود تحميل.js"
        const messageText = (msg.message?.conversation || '')  // الرسالة النصية
          || (msg.message?.extendedTextMessage?.text || '');

        // استخراج كلمة بعد الأمر (كود)
        // افتراض الأمر يبدأ بنقطة مع اسم الأمر
        // نقسم الرسالة ونأخذ الكلمة الثانية
        const parts = messageText.trim().split(/\s+/);
        if (parts.length > 1) {
          pluginName = parts.slice(1).join(' ').trim();
        }
      }

      if (!pluginName) {
        // إذا ما في اسم ملف
        const list = allFiles.map(f => `🌋 ${f}`).join('\n');
        return sock.sendMessage(jid, {
          text: `📂 *قائمة البلوجينات:* (${allFiles.length})\n\n${list}`
        }, { quoted: msg });
      }

      if (!pluginName.endsWith('.js')) pluginName += '.js';

      if (!allFiles.includes(pluginName)) {
        return sock.sendMessage(jid, {
          text: `❌ البلوجين *${pluginName}* غير موجود ضمن مجلد plugins.`
        }, { quoted: msg });
      }

      await sock.sendMessage(jid, { text: `🔍 جاري قراءة البلوجين: ${pluginName} ...` }, { quoted: msg });

      const filePath = path.join(pluginsFolder, pluginName);
      const code = fs.readFileSync(filePath, 'utf-8');

      const chunks = code.match(/[\s\S]{1,4000}/g) || [];

      for (let i = 0; i < chunks.length; i++) {
        await sock.sendMessage(jid, {
          text: `📜 *${pluginName}* (جزء ${i + 1}/${chunks.length}):\n\n${chunks[i]}`
        }, { quoted: msg });
      }

    } catch (error) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: `❌ حدث خطأ:\n${error.message || error.toString()}`
      }, { quoted: msg });
    }
  }
};