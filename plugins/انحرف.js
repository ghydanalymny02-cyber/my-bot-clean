const { isElite } = require('../haykala/elite.js');
const { readFileSync } = require('fs');
const { join } = require('path');

module.exports = {
    name: 'انحرف',
    command: ['انحرف'],
    category: 'ترفيه',
    description: 'يرسل ملصق عند طلب النخبة.',
    async execute(sock, m) {
        const sender = m.key.participant || m.key.remoteJid;
        const senderNum = sender.split('@')[0];

        if (!isElite(senderNum)) {
            return sock.sendMessage(m.key.remoteJid, {
                text: '❌ هذا الأمر خاص بالنخبة فقط.'
            }, { quoted: m });
        }

        const stickerPath = join(__dirname, '../resources/in7arfi.webp');
        const stickerBuffer = readFileSync(stickerPath);

        return sock.sendMessage(m.key.remoteJid, {
            sticker: stickerBuffer
        }, { quoted: m });
    }
};