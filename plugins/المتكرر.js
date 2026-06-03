const fs = require('fs');
const path = require('path');

module.exports = {
  command: ['المتكرر'],
  description: '🧠 يكتشف الأوامر المكررة (كاملة أو جزئية)',
  category: 'DEVELOPER',
  usage: '.المتكرر',
  async execute(sock, msg) {
    // 👇 استخدم import علشان elite.js مكتوب بـ ESM
    const { isElite } = await import('file://' + path.join(process.cwd(), 'haykala', 'elite.js'));

    const sender = msg.participant || msg.key.participant || msg.key.remoteJid;

    if (!isElite(sender)) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '🚫 يا نجم، الأمر ده مخصص للنخبة بس 😎'
      }, { quoted: msg });
    }

    const folderPath = __dirname;
    const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.js'));
    const allCommands = [];

    for (const file of files) {
      try {
        const plugin = require(path.join(folderPath, file));
        if (!plugin.command) continue;

        allCommands.push({
          file,
          command: plugin.command,
          description: plugin.description || '',
          usage: plugin.usage || '',
          category: plugin.category || '',
          full: plugin
        });
      } catch (err) {
        console.log(`⚠️ خطأ في ${file}: ${err.message}`);
      }
    }

    const repeatedExact = [];
    const repeatedPartial = [];

    for (let i = 0; i < allCommands.length; i++) {
      for (let j = i + 1; j < allCommands.length; j++) {
        const a = allCommands[i];
        const b = allCommands[j];

        const normalize = obj => JSON.stringify({
          command: obj.command,
          description: obj.description,
          usage: obj.usage,
          category: obj.category
        });

        if (normalize(a) === normalize(b)) {
          repeatedExact.push([a, b]);
        } else {
          const aCommands = Array.isArray(a.command) ? a.command : [a.command];
          const bCommands = Array.isArray(b.command) ? b.command : [b.command];
          const common = aCommands.filter(cmd => bCommands.includes(cmd));
          if (common.length > 0) {
            repeatedPartial.push({
              shared: common,
              files: [a.file, b.file],
              infoA: normalize(a),
              infoB: normalize(b)
            });
          }
        }
      }
    }

    let response = '🔍 نتائج البحث عن الأوامر المكررة:\n\n';

    if (repeatedExact.length > 0) {
      response += `✅ أوامر مكررة بالكامل (${repeatedExact.length}):\n`;
      repeatedExact.forEach(([a, b], idx) => {
        response += `\n${idx + 1}. ${a.file} ↔ ${b.file}\n📌 .${Array.isArray(a.command) ? a.command.join(', .') : a.command}`;
      });
      response += '\n\n';
    }

    if (repeatedPartial.length > 0) {
      response += `⚠ أوامر فيها تكرار جزئي (${repeatedPartial.length}):\n`;
      repeatedPartial.forEach((item, idx) => {
        response += `\n${idx + 1}. [ ${item.files.join(' ↔ ')} ]\n🔁 مشترك: .${item.shared.join(', .')}`;
      });
    }

    if (repeatedExact.length === 0 && repeatedPartial.length === 0) {
      response = '✅ لا يوجد تكرار في الأوامر تمامًا أو جزئيًا.\nكل شيء تمام يا باشا 🔥';
    }

    await sock.sendMessage(msg.key.remoteJid, { text: response }, { quoted: msg });
  }
};