const { isElite } = require('../haykala/elite.js');

module.exports = {
    command: 'منشن_النخبة',
    description: 'يقوم بمنشن جميع أعضاء النخبة في الجروب.',
    usage: '.منشن_النخبة',
    
    async execute(sock, msg) {
        try {
            const chatId = msg.key.remoteJid;

            // الحصول على أعضاء الجروب
            const groupMetadata = await sock.groupMetadata(chatId);
            const participants = groupMetadata.participants || [];

            // تصفية النخبة فقط
            const eliteMembers = participants
                .map(p => p.id)
                .filter(jid => isElite(jid));

            if (eliteMembers.length === 0) {
                return sock.sendMessage(chatId, {
                    text: '❌ لا يوجد أعضاء نخبة في هذا الجروب.'
                }, { quoted: msg });
            }

            // بناء النص مع منشن
            const mentionsText = eliteMembers.map(jid => `@${jid.split('@')[0]}`).join(' ');
            
            await sock.sendMessage(chatId, {
                text: `منوريين يا نخبة 🫦 :\n\n${mentionsText}`,
                mentions: eliteMembers
            }, { quoted: msg });

        } catch (error) {
            console.error('❌ حدث خطأ أثناء منشن النخبة:', error);
            await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ حدث خطأ أثناء تنفيذ الأمر، حاول مرة أخرى.'
            }, { quoted: msg });
        }
    }
};