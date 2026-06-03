const { getDevice, jidDecode } = require('@whiskeysockets/baileys');
const { eliteNumbers } = require('../haykala/elite.js');

const decode = jid => (jidDecode(jid)?.user || jid.split('@')[0]) + '@s.whatsapp.net';

module.exports = {
    command: 'جهاز',
    description: 'عرض الجهاز المستخدم لإرسال الرسالة',
    usage: '.جهاز [منشن/ريبلاي]',
    category: 'tools',

    async execute(sock, msg) {
        const jid = msg.key.remoteJid;
        const senderJid = msg.key?.participant || msg.key?.remoteJid || msg.participant || msg.sender;
        const senderLid = senderJid.split('@')[0];

        // تحقق من النخبة
        if (!eliteNumbers.includes(senderLid)) {
            return await sock.sendMessage(jid, {
                text: '❗ لا تملك صلاحية استخدام هذا الأمر.'
            }, { quoted: msg });
        }

        // تحديد الهدف: منشن - ريبلاي - أو نفسه
        let targetJid;
        if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
            targetJid = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
        } else if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
            targetJid = msg.message.extendedTextMessage.contextInfo.participant;
        } else {
            targetJid = senderJid;
        }

        try {
            const device = await getDevice(msg.key.id);

            const text = `
📱 *الجهاز المستخدم:* ${device}
👤 *الشخص:* @${targetJid.split('@')[0]}
`;

            await sock.sendMessage(jid, {
                text,
                mentions: [targetJid]
            }, { quoted: msg });

        } catch (err) {
            await sock.sendMessage(jid, {
                text: '⚠️ فشل الحصول على الجهاز.'
            }, { quoted: msg });
        }
    }
};