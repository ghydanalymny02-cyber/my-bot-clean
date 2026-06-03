const { eliteNumbers } = require('../haykala/elite.js');
const { jidDecode } = require('@whiskeysockets/baileys');
const decode = jid => (jidDecode(jid)?.user || jid.split('@')[0]) + '@s.whatsapp.net';

module.exports = {
    command: 'خفض',
    description: 'ينزل شخص من الإشراف (خاص بالنخبة)',
    usage: '.خفض @منشن',
    category: 'group',

    async execute(sock, msg) {
        try {
            const groupJid = msg.key.remoteJid;
            const sender = decode(msg.key.participant || groupJid);
            const senderLid = sender.split('@')[0];

            if (!groupJid.endsWith('@g.us'))
                return await sock.sendMessage(groupJid, { text: '❗ هذا الأمر يعمل فقط داخل المجموعات.' }, { quoted: msg });

            if (!eliteNumbers.includes(senderLid))
                return await sock.sendMessage(groupJid, { text: '❗ هذا الأمر مخصص للنخبة فقط.' }, { quoted: msg });

            const mentions = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            if (!mentions || mentions.length === 0)
                return await sock.sendMessage(groupJid, { text: '❗ من فضلك منشن الشخص اللي عايز تنزله.' }, { quoted: msg });

            const targetId = mentions[0];
            await sock.groupParticipantsUpdate(groupJid, [targetId], 'demote');
            await sock.sendMessage(groupJid, {
                text: `✅ تم خفض ${targetId.split('@')[0]} من الإشراف.`,
                mentions: [targetId]
            }, { quoted: msg });

        } catch (error) {
            console.error('❌ خطأ في أمر خفض:', error);
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ حصل خطأ أثناء تنفيذ الأمر:\n${error.message || error.toString()}`
            }, { quoted: msg });
        }
    }
};