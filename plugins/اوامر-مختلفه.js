const fs = require('fs');
const path = require('path');
const { isElite } = require('../haykala/elite.js');

module.exports = {
  command: ['مختلفه'],
  description: '📛 يجيب كل الأوامر اللي اسم الملف مش زي اسم الأمر',
  category: 'DEVELOPER',
  status: 'on',
  version: '1.2',

  async execute(sock, msg) {
    const from = msg.key.remoteJid;
    const sender = msg.participant || msg.key.participant || msg.key.remoteJid;

    // التحقق من النخبة
    if (!(await isElite(sender))) {
      return await sock.sendMessage(from, {
        text: '❌ هذا الأمر مخصص للنخبة فقط.',
      }, { quoted: msg });
    }

    const pluginsDir = path.join(process.cwd(), 'plugins');
    const files = fs.readdirSync(pluginsDir).filter(f => f.endsWith('.js'));
    const results = [];

    for (const file of files) {
      const filePath = path.join(pluginsDir, file);
      try {
        const plugin = require(filePath);

        if (!plugin.command) continue;

        const fileName = path.basename(file, '.js').toLowerCase();
        const commands = Array.isArray(plugin.command) ? plugin.command : [plugin.command];

        const hasMatch = commands.some(cmd => cmd.toLowerCase() === fileName);

        if (!hasMatch) {
          results.push(`🔰 *${file}*\n⚜ ➤ ${commands.join(', ')}`);
        }

      } catch (err) {
        results.push(`❌ خطأ في ملف *${file}*: ${err.message}`);
      }
    }

    const finalText = results.length
      ? `📛 أوامر الملف مش متطابقة مع اسم الملف:\n\n${results.join('\n\n')}`
      : `✅ كل الأوامر متطابقة مع أسماء الملفات`;

    try {
      await sock.sendMessage(from, { text: finalText }, { quoted: msg });
    } catch (err) {
      console.error("خطأ أثناء إرسال الرسالة:", err);
    }
  }
};