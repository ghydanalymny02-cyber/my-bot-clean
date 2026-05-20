const { eliteNumbers } = require('../haykala/elite.js');
const { jidDecode } = require('@whiskeysockets/baileys');

const decode = jid => (jidDecode(jid)?.user || jid.split('@')[0]) + '@s.whatsapp.net';

module.exports = {
    command: 'شات_قفل',
    description: 'يقفل المجموعة ويمنع الأعضاء من الكتابة',
    usage: '.شات_قفل',
    category: 'group',

    async execute(sock, msg) {
        try {
            const groupJid = msg.key.remoteJid;
            const sender = decode(msg.key.participant || groupJid);
            const senderLid = sender.split('@')[0];

            if (!groupJid.endsWith('@g.us'))
                return await sock.sendMessage(groupJid, { text: '❗ هذا الأمر يعمل فقط داخل المجموعات.' }, { quoted: msg });

            if (!eliteNumbers.includes(senderLid))
                return await sock.sendMessage(groupJid, { text: '❗ لا تملك صلاحية استخدام هذا الأمر.' }, { quoted: msg });

            const groupMetadata = await sock.groupMetadata(groupJid);

            if (groupMetadata.announce === true) {
                return await sock.sendMessage(groupJid, { text: '🔒 المجموعة مقفولة بالفعل.' }, { quoted: msg });
            }

            await sock.groupSettingUpdate(groupJid, 'announcement');
            await sock.sendMessage(groupJid, {
                text: '🔒 تم قفل المجموعة، فقط المشرفين يمكنهم الكتابة.'
            }, { quoted: msg });

        } catch (error) {
            console.error('❌ خطأ في أمر قفل:', error);
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ حدث خطأ:\n\n${error.message || error.toString()}`
            }, { quoted: msg });
        }
    }
};