const fs = require('fs');
const path = require('path');
const { eliteNumbers } = require('../haykala/elite.js');

module.exports = {
  command: ['باتش-ابحث'],
  description: '🕵️‍♂️ يبحث في كل الأكواد عن كلمة معينة ويعرض الأسطر اللي فيها.',
  category: 'DEVELOPER',

  async execute(sock, msg) {
    const sender = msg.key.participant || msg.key.remoteJid;
    const senderNumber = sender.split('@')[0];
    if (!eliteNumbers.includes(senderNumber)) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ هذا الأمر مخصص للنخبة فقط.',
      }, { quoted: msg });
    }

    const fullText =
      msg.message?.conversation ||
      msg.message?.extendedTextMessage?.text ||
      '';

    const commandName = fullText.split(' ')[0]?.toLowerCase();
    const inputText = fullText.slice(commandName.length).trim();

    if (!inputText) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: `📝 اكتب الكلمة اللي عايز تدور عليها بعد الأمر يا نجم.\n\nمثال:\n.هات-من-كود pointsFile`,
      }, { quoted: msg });
    }

    const pluginsDir = path.resolve('./plugins');
    let results = [];

    function searchInFile(filePath) {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        if (line.toLowerCase().includes(inputText.toLowerCase())) {
          results.push(`📁 ${path.basename(filePath)} | سطر ${index + 1}:\n${line.trim()}`);
        }
      });
    }

    function walkDir(dir) {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          walkDir(fullPath);
        } else if (file.endsWith('.js') && !file.startsWith('_')) {
          searchInFile(fullPath);
        }
      });
    }

    walkDir(pluginsDir);

    if (results.length === 0) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ مفيش أي كود فيه الكلمة: "${inputText}"`,
      }, { quoted: msg });
    }

    const allChunks = [];
    let chunk = '';

    for (const result of results) {
      if ((chunk + '\n\n' + result).length > 4000) {
        allChunks.push(chunk);
        chunk = result;
      } else {
        chunk += '\n\n' + result;
      }
    }
    if (chunk) allChunks.push(chunk);

    for (let i = 0; i < allChunks.length; i++) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: `🔍 نتائج البحث عن "${inputText}" (جزء ${i + 1}/${allChunks.length}):\n\n${allChunks[i]}`
      }, { quoted: msg });
    }
  }
};