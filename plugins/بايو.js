const { jidDecode } = require('@whiskeysockets/baileys');

const decode = jid => (jidDecode(jid)?.user || jid.split('@')[0]) + '@s.whatsapp.net';

module.exports = {
    command: 'بايو',
    description: 'عرض بايو واتساب لأي رقم',
    category: 'INFO',
    usage: '.بايو 20XXXXXXXXX',

    async execute(sock, msg) {
        try {
            const body = msg.message?.extendedTextMessage?.text || msg.message?.conversation || '';
            const args = body.trim().split(' ').slice(1);

            if (args.length < 1) {
                return await sock.sendMessage(msg.key.remoteJid, {
                    text: `❌ استخدم الأمر بالشكل الصحيح:\n.بايو 20XXXXXXXXX`
                }, { quoted: msg });
            }

            const phoneNumber = args[0].replace(/[^0-9]/g, '');
            if (phoneNumber.length < 8) {
                return await sock.sendMessage(msg.key.remoteJid, {
                    text: '❌ رقم الهاتف غير صالح'
                }, { quoted: msg });
            }

            const waitMsg = await sock.sendMessage(msg.key.remoteJid, {
                text: '⏳ جاري البحث عن المعلومات...'
            }, { quoted: msg });

            const id = `${phoneNumber}@s.whatsapp.net`;
            const exists = await sock.onWhatsApp(phoneNumber);

            if (!exists || exists.length === 0 || !exists[0].exists) {
                return await sock.sendMessage(msg.key.remoteJid, {
                    text: `❌ لم يتم العثور على أي حساب للرقم ${phoneNumber}`
                }, { quoted: msg });
            }

            const profile = await sock.fetchStatus(id).catch(() => null);

            if (profile) {
                let message = `📱 *معلومات البايو لـ ${phoneNumber}:*\n\n`;
                message += `🔖 *البايو:* ${profile.status || 'لا يوجد'}\n`;
                message += `📅 *آخر تحديث:* ${profile.setAt ? new Date(profile.setAt).toLocaleString('ar-EG') : 'غير معروف'}`;

                await sock.sendMessage(msg.key.remoteJid, { text: message }, { quoted: msg });
            } else {
                await sock.sendMessage(msg.key.remoteJid, {
                    text: `❌ لا يمكن الوصول إلى بايو الرقم ${phoneNumber}`
                }, { quoted: msg });
            }

        } catch (error) {
            console.error("❌ خطأ في أمر بايو:", error);
            await sock.sendMessage(msg.key.remoteJid, {
                text: `⚠️ حصل خطأ: ${error.message || error.toString()}`
            }, { quoted: msg });
        }
    }
};