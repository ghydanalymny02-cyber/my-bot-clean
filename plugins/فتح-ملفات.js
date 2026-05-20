const fs = require('fs');
const path = require('path');
const { eliteNumbers } = require('../haykala/elite.js');

module.exports = {
  command: ['فتح'],
  description: '📂 عرض الملفات داخل مجلد معين.',
  category: 'developer',

  async execute(sock, msg) {
    const sender = msg.key.participant || msg.key.remoteJid;
    const senderNumber = sender.split('@')[0];
    if (!eliteNumbers.includes(senderNumber)) return sock.sendMessage(msg.key.remoteJid, { text: '❌ للنخبة فقط' }, { quoted: msg });

    const baseDir = path.resolve('./');
    const inputText = msg.message?.conversation?.split(' ').slice(1).join(' ').trim() ||
                      msg.message?.extendedTextMessage?.text?.split(' ').slice(1).join(' ').trim();

    const folders = fs.readdirSync(baseDir).filter(f => fs.statSync(path.join(baseDir, f)).isDirectory() && !['node_modules', '.git', 'ملف_الاتصال'].includes(f));
    let selectedFolder = '';

    if (/^\d+$/.test(inputText)) {
      const index = parseInt(inputText) - 1;
      if (index >= 0 && index < folders.length) selectedFolder = folders[index];
    } else {
      selectedFolder = folders.find(f => f.toLowerCase().includes(inputText.toLowerCase()));
    }

    if (!selectedFolder) return sock.sendMessage(msg.key.remoteJid, { text: `❌ لم يتم العثور على المجلد.` }, { quoted: msg });

    const files = fs.readdirSync(path.join(baseDir, selectedFolder)).filter(f => f.endsWith('.js') || f.endsWith('.json'));
    if (files.length === 0) return sock.sendMessage(msg.key.remoteJid, { text: '📁 لا يوجد ملفات صالحة في هذا المجلد.' }, { quoted: msg });

    const fileList = files.map((f, i) => `│ ${i + 1}. ${selectedFolder}/${f}`).join('\n');
    return sock.sendMessage(msg.key.remoteJid, {
      text: `📄 *ملفات داخل مجلد ${selectedFolder}:*\n${fileList}`
    }, { quoted: msg });
  }
}