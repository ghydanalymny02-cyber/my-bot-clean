const { isElite } = require('../haykala/elite.js');
const { jidDecode } = require('@whiskeysockets/baileys');

const decode = jid => (jidDecode(jid)?.user || jid.split('@')[0]) + '@s.whatsapp.net';

module.exports = {
    command: 'شات',
    description: 'إدارة إعدادات الجروب من فتح أو قفل.',
    category: 'group',
    usage: '.شات [ف|ق]',

    async execute(sock, msg) {
        try {
            const groupJid = msg.key.remoteJid;
            const sender = decode(msg.key.participant || groupJid);
            const senderLid = sender.split('@')[0];

            if (!groupJid.endsWith('@g.us')) {
                return await sock.sendMessage(groupJid, {
                    text: '❗ هذا الأمر يعمل فقط داخل المجموعات.'
                }, { quoted: msg });
            }

            if (!isElite(senderLid)) {
                return await sock.sendMessage(groupJid, {
                    text: '❌ ليس لديك صلاحية لاستخدام هذا الأمر.'
                }, { quoted: msg });
            }

            const body = msg.message?.extendedTextMessage?.text ||
                         msg.message?.conversation || '';
            const lower = body.toLowerCase();

            let option = null;
            if (lower.includes('ف')) option = 'ف';
            else if (lower.includes('ق')) option = 'ق';

            if (!option) {
                return await sock.sendMessage(groupJid, {
                    text: '❌ يرجى تحديد الخيار: .شات ف أو .شات ق'
                }, { quoted: msg });
            }

            if (option === 'ف') {
                await sock.groupSettingUpdate(groupJid, 'not_announcement');
            } else if (option === 'ق') {
                await sock.groupSettingUpdate(groupJid, 'announcement');
            }

        } catch (error) {
            console.error('✗ خطأ في أمر الشات:', error);
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ حدث خطأ أثناء تنفيذ الأمر:\n\n${error.message || error.toString()}`
            }, { quoted: msg });
        }
    }
};