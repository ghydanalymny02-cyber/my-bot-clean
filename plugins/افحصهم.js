const fs = require('fs');
const path = require('path');
const { eliteNumbers, extractPureNumber } = require('../haykala/elite'); // استدعاء النخبة

module.exports = {
  command: 'افحصهم',
  category: 'DEVELOPER',
  description: 'يفحص جميع ملفات الأوامر داخل مجلد plugins ويعرض الخربانة منها (للنخبة فقط)',

  async execute(sock, msg, args) {
    const sender = extractPureNumber(msg.key.participant || msg.key.remoteJid);

    // الشرط للنخبة
    if (!eliteNumbers.includes(sender)) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "🚫 الأمر دا للنخبة بس يا معلم 👑",
        quoted: msg
      });
    }

    const pluginsPath = path.join(__dirname);
    const files = fs.readdirSync(pluginsPath).filter(file => file.endsWith('.js'));
    const results = [];

    for (const file of files) {
      const fullPath = path.join(pluginsPath, file);
      try {
        const plugin = require(fullPath);

        // التحقق من العناصر الأساسية
        if (!plugin.command || !plugin.execute) {
          results.push(`⚠️ [${file}]: ناقص خصائص أساسية (command أو execute)`);
        } else {
          results.push(`✅ [${file}]: سليم`);
        }
      } catch (err) {
        results.push(`❌ [${file}]: فيه خطأ → ${err.message.split('\n')[0]}`);
      }
    }

    // إرسال التقرير
    const report = results.join('\n') || 'كلشي تمام ✅';
    await sock.sendMessage(msg.key.remoteJid, { text: `📦 تقرير فحص الإضافات:\n\n${report}` });
  }
};