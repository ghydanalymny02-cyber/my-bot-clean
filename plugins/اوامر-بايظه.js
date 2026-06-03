const fs = require('fs');
const { join } = require('path');

module.exports = {
  command: ['بايظه'],
  category: 'tools',
  description: '🔍 يكتشف الأوامر البايظة أو الناقصة أو المتكررة',
  status: 'on',
  version: '1.0',

  async execute(sock, msg) {
    const pluginDir = join(process.cwd(), 'plugins');
    const files = fs.readdirSync(pluginDir).filter(f => f.endsWith('.js'));
    const badPlugins = [];
    const seenCommands = new Map();

    for (const file of files) {
      const filePath = join(pluginDir, file);
      let plugin;
      try {
        delete require.cache[require.resolve(filePath)];
        plugin = require(filePath);
      } catch (err) {
        badPlugins.push({ file, issue: '❌ خطأ في التحميل' });
        continue;
      }

      const cmds = plugin.command;
      const hasCommand = cmds && (Array.isArray(cmds) ? cmds.length > 0 : true);
      const hasExecute = typeof plugin.execute === 'function';

      if (!hasCommand) badPlugins.push({ file, issue: '⚠️ مفيش command' });
      if (!hasExecute) badPlugins.push({ file, issue: '⚠️ مفيش execute' });

      if (Array.isArray(cmds)) {
        for (const cmd of cmds) {
          const lowerCmd = cmd.toLowerCase();
          if (seenCommands.has(lowerCmd)) {
            badPlugins.push({ file, issue: `🔁 مكرر مع ${seenCommands.get(lowerCmd)}` });
          } else {
            seenCommands.set(lowerCmd, file);
          }
        }
      } else if (typeof cmds === 'string') {
        const lowerCmd = cmds.toLowerCase();
        if (seenCommands.has(lowerCmd)) {
          badPlugins.push({ file, issue: `🔁 مكرر مع ${seenCommands.get(lowerCmd)}` });
        } else {
          seenCommands.set(lowerCmd, file);
        }
      }
    }

    if (badPlugins.length === 0) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '✅ مفيش أوامر بايظة ولا مكررة، كله تمام يا نجم 🎯'
      }, { quoted: msg });
    }

    const report = badPlugins.map((p, i) =>
      `*${i + 1}. ${p.file}*\n${p.issue}`
    ).join('\n\n');

    const finalMessage = `╭─〔 ⚠️ فحص الأوامر 〕─╮\n\n${report}\n\n╰──────〔 ${badPlugins.length} مشكلة 〕──────╯`;

    await sock.sendMessage(msg.key.remoteJid, {
      text: finalMessage
    }, { quoted: msg });
  }
};