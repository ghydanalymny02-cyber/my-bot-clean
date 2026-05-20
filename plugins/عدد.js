const { isElite } = require('../haykala/elite');

module.exports = {
    command: 'عدد',
    description: 'يعرض عدد الأعضاء وعدد المشرفين في الجروب (خاص بالنخبة)',
    usage: '.عدد',
    category: 'info',

    async execute(sock, msg) {
        try {
            const groupJid = msg.key.remoteJid;

            // التأكد من أنه داخل جروب
            if (!groupJid.endsWith('@g.us')) {
                return sock.sendMessage(groupJid, {
                    text: '❌ هذا الأمر مخصص فقط للجروبات.'
                }, { quoted: msg });
            }

            // التحقق من النخبة
            const sender = msg.key.participant || msg.key.remoteJid;
            if (!isElite(sender)) {
                return sock.sendMessage(groupJid, {
                    text: '❌ هذا الأمر مخصص للنخبة فقط.'
                }, { quoted: msg });
            }

            // جلب معلومات الجروب
            const metadata = await sock.groupMetadata(groupJid);

            const membersCount = metadata.participants.length;
            const adminsCount = metadata.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin').length;

            // إرسال عدد الأعضاء والمشرفين
            await sock.sendMessage(groupJid, {
                text: `👥 عدد أعضاء الجروب: *${membersCount}*\n🛡️ عدد المشرفين: *${adminsCount}*`
            }, { quoted: msg });

        } catch (error) {
            console.error('❌ حدث خطأ أثناء تنفيذ أمر عدد:', error);
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ حدث خطأ:\n${error.message || error.toString()}`
            }, { quoted: msg });
        }
    }
};