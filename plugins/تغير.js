const { eliteNumbers } = require('../haykala/elite.js');

module.exports = {
    command: 'تغير',
    description: 'تغيير صورة المجموعة (رد على صورة)',
    category: 'group',

    async execute(sock, msg) {
        const groupJid = msg.key.remoteJid;
        const sender = msg.key.participant || msg.participant || msg.key.remoteJid;
        const senderLid = sender.split('@')[0];

        if (!eliteNumbers.includes(senderLid)) {
            return await sock.sendMessage(groupJid, { text: '❗ هذا الأمر خاص بالنخبة فقط.' }, { quoted: msg });
        }

        const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quotedMsg || !quotedMsg.imageMessage) {
            return await sock.sendMessage(groupJid, { text: '❗ الرجاء الرد على صورة لتغيير صورة المجموعة.' }, { quoted: msg });
        }

        try {
            const buffer = await sock.downloadMediaMessage({ message: quotedMsg });
            await sock.updateProfilePicture(groupJid, buffer);
            await sock.sendMessage(groupJid, { text: '✅ تم تغيير صورة المجموعة بنجاح.' }, { quoted: msg });
        } catch (err) {
            await sock.sendMessage(groupJid, { text: `❌ حدث خطأ: ${err.message}` }, { quoted: msg });
        }
    }
};
