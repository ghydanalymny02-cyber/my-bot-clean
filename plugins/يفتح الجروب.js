const { eliteNumbers } = require('../haykala/elite.js');
const { jidDecode } = require('@whiskeysockets/baileys');

const decode = jid => (jidDecode(jid)?.user || jid.split('@')[0]) + '@s.whatsapp.net';

module.exports = {
    command: 'شات_فتح',
    description: 'فتح المجموعة للأعضاء',
    usage: '.شات_فتح',
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
                await sock.groupSettingUpdate(groupJid, 'not_announcement');
                return await sock.sendMessage(groupJid, { text: '✅ تم فتح المجموعة، يمكن للأعضاء الكتابة الآن.' }, { quoted: msg });
            } else {
                return await sock.sendMessage(groupJid, { text: 'ℹ️ المجموعة مفتوحة بالفعل.' }, { quoted: msg });
            }

        } catch (error) {
            console.error('❌ خطأ في أمر فتح:', error);
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ حدث خطأ:\n\n${error.message || error.toString()}`
            }, { quoted: msg });
        }
    }
};