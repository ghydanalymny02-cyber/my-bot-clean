const { readFileSync, existsSync } = require('fs');
const { join } = require('path');

module.exports = {
    name: 'اضحك',
    command: ['اضحك'],
    category: 'ترفيه',
    description: '😂 يرد على الرسالة بملصق ثابت.',

    async execute(sock, m) {
        const replyMsg = m.message?.extendedTextMessage?.contextInfo?.quotedMessage
            ? {
                key: {
                    remoteJid: m.key.remoteJid,
                    fromMe: false,
                    id: m.message.extendedTextMessage.contextInfo.stanzaId,
                    participant: m.message.extendedTextMessage.contextInfo.participant
                },
                message: m.message.extendedTextMessage.contextInfo.quotedMessage
            }
            : m; // لو مفيش رسالة متعملها ريبلاي، يرد على رسالتك إنت

        const stickerPath = join(__dirname, '../resources/rabit.webp');

        if (!existsSync(stickerPath)) {
            return sock.sendMessage(m.key.remoteJid, {
                text: '⚠️ مش لاقي الملصق rabit.webp في media!'
            }, { quoted: replyMsg });
        }

        const stickerBuffer = readFileSync(stickerPath);

        return sock.sendMessage(m.key.remoteJid, {
            sticker: stickerBuffer
        }, { quoted: replyMsg });
    }
};