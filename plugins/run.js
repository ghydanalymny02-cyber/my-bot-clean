// plugin: run.js
// 🚀 شغّل أي كود JavaScript سواء كان بلاجن أو كود عادي (خاص بالنخبة)

const fs = require('fs');
const path = require('path');
const vm = require('vm'); // لتشغيل الأكواد العادية
const { eliteNumbers } = require('../haykala/elite.js');

const dataFile = path.resolve('./data/run-counter.json');
const pluginsDir = path.resolve('./plugins');
const trashDir = path.resolve('./tmp/trash'); // 📂 فولدر التراش

if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify({ counter: 0 }, null, 2));
if (!fs.existsSync(trashDir)) fs.mkdirSync(trashDir, { recursive: true }); // إنشاء التراش لو مش موجود

function getCounter() {
  return JSON.parse(fs.readFileSync(dataFile, 'utf-8')).counter;
}
function setCounter(value) {
  fs.writeFileSync(dataFile, JSON.stringify({ counter: value }, null, 2));
}

module.exports = {
  command: ['run'],
  description: '🚀 شغّل أي كود JavaScript (بلاجن أو كود عادي)',
  category: 'DEVELOPER',

  async execute(sock, msg) {
    const sender = msg.key.participant || msg.key.remoteJid;
    const senderNumber = sender.split('@')[0];
    if (!eliteNumbers.includes(senderNumber)) {
      return await sock.sendMessage(msg.key.remoteJid, { text: '❌ هذا الأمر مخصص للنخبة فقط.' }, { quoted: msg });
    }

    const text =
      msg.message?.conversation ||
      msg.message?.extendedTextMessage?.text ||
      '';
    let codeToRun = text.replace(/^\.(run)\s*/i, '').trim();

    if (!codeToRun && msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
      codeToRun =
        msg.message.extendedTextMessage.contextInfo.quotedMessage.conversation ||
        msg.message.extendedTextMessage.contextInfo.quotedMessage.extendedTextMessage?.text ||
        '';
    }

    if (!codeToRun) {
      return await sock.sendMessage(msg.key.remoteJid, { text: '⚠️ اكتب الكود بعد .run أو رد على الكود مباشرة.' }, { quoted: msg });
    }

    // عدّاد الملفات
    let counter = getCounter() + 1;
    setCounter(counter);

    const fileName = `run${counter}.js`;
    const filePath = path.join(pluginsDir, fileName);
    const trashPath = path.join(trashDir, fileName);

    try {
      // احفظ الملف
      fs.writeFileSync(filePath, codeToRun, 'utf-8');

      let plugin;
      let isPlugin = codeToRun.includes('module.exports');

      if (isPlugin) {
        // نفس نظام البلاجن الأصلي
        try {
          const resolved = require.resolve(filePath);
          if (require.cache[resolved]) delete require.cache[resolved];
          plugin = require(filePath);
        } catch (e) {
          await sock.sendMessage(msg.key.remoteJid, { text: `❌ خطأ في البلاجن: ${e.message}` }, { quoted: msg });
          return;
        }

        if (!plugin || !plugin.execute || !plugin.command) {
          await sock.sendMessage(msg.key.remoteJid, { text: '⚠️ الكود مش بلاجن صالح — لازم فيه command و execute.' }, { quoted: msg });
          return;
        }

        global.plugins = global.plugins || {};
        global.plugins[fileName] = plugin;

        const cmdName = Array.isArray(plugin.command) ? plugin.command[0] : plugin.command;
        await sock.sendMessage(msg.key.remoteJid, { text: `📥 بلاجن *${fileName}* اتسجل بالأمر \`.${cmdName}\` ✅` }, { quoted: msg });

        // نفذ
        const originalConversation = msg.message?.conversation;
        try {
          if (!msg.message) msg.message = {};
          msg.message.conversation = `.${cmdName}`;
          await plugin.execute(sock, msg);
        } catch (e) {
          await sock.sendMessage(msg.key.remoteJid, { text: `❌ خطأ في التنفيذ: ${e.message}` }, { quoted: msg });
        } finally {
          msg.message.conversation = originalConversation;
        }

      } else {
        // كود عادي → نشغله بـ vm
        try {
          let output = '';
          const sandbox = {
            console: {
              log: (...args) => {
                output += args.join(' ') + '\n';
              }
            },
            require,
            module,
            exports
          };
          vm.createContext(sandbox);
          vm.runInContext(codeToRun, sandbox);

          await sock.sendMessage(msg.key.remoteJid, { text: `✅ تم تشغيل الكود:\n\n${output || '⚡ بدون ناتج'}` }, { quoted: msg });
        } catch (e) {
          await sock.sendMessage(msg.key.remoteJid, { text: `❌ خطأ أثناء التشغيل: ${e.message}` }, { quoted: msg });
        }
      }

      // 🗑️ بعد التشغيل → انقل للتراش
      fs.renameSync(filePath, trashPath);

    } catch (err) {
      return await sock.sendMessage(msg.key.remoteJid, { text: `❌ خطأ: ${err.message}` }, { quoted: msg });
    }
  }
};