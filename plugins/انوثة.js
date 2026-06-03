module.exports = {
    command: 'أنوثة',
    description: 'يعطي نسبة أنوثة لشخص معين أو لك 💖',
    usage: '.أنوثة [منشن/رد على شخص]',
    category: 'fun',

    async execute(sock, msg) {
        try {
            const chatId = msg.key.remoteJid;
            const sender = msg.key.participant || msg.key.remoteJid;

            let targetName = '';
            let targetId = '';

            // إذا تم الرد على رسالة
            const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant;
            if (quoted) {
                targetId = quoted;
                targetName = quoted.split('@')[0];
            } 
            // إذا تم منشن شخص
            else if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
                targetId = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
                targetName = targetId.split('@')[0];
            } 
            // إذا لا منشن ولا رد، يعتبر المرسل نفسه
            else {
                targetId = sender;
                targetName = sender.split('@')[0];
            }

            // رقم عشوائي من 1 إلى 100
            const percentage = Math.floor(Math.random() * 100) + 1;

            await sock.sendMessage(chatId, {
                text: `💖 نسبة الأنوثة لدى @${targetName}: ${percentage}%`,
                mentions: [targetId]
            }, { quoted: msg });

        } catch (error) {
            console.error('❌ حدث خطأ أثناء تنفيذ أمر أنوثة:', error);
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ حصل خطأ:\n${error.message || error.toString()}`
            }, { quoted: msg });
        }
    }
};