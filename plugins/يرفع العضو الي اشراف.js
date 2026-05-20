const { eliteNumbers } = require('../haykala/elite.js');
const { jidDecode } = require('@whiskeysockets/baileys');
const decode = jid => (jidDecode(jid)?.user || jid.split('@')[0]) + '@s.whatsapp.net';

module.exports = {
    command: 'ارفع',
    description: 'يرفع شخص إلى مشرف (خاص بالنخبة)',
    usage: '.ارفع @منشن',
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
                return await sock.sendMessage(groupJid, { text: '❗ من فضلك منشن الشخص اللي عايز ترفعه.' }, { quoted: msg });

            const targetId = mentions[0];
            await sock.groupParticipantsUpdate(groupJid, [targetId], 'promote');
            await sock.sendMessage(groupJid, {
                text: `✅ تم رفع ${targetId.split('@')[0]} إلى مشرف.`,
                mentions: [targetId]
            }, { quoted: msg });

        } catch (error) {
            console.error('❌ خطأ في أمر ارفع:', error);
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ حصل خطأ أثناء تنفيذ الأمر:\n${error.message || error.toString()}`
            }, { quoted: msg });
        }
    }
};