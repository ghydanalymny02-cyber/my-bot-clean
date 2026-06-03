module.exports = {
    command: 'عصبية',
    description: 'يقيس نسبة العصبية للشخص الممنشن أو لك إذا لم يتم المنشن',
    usage: '.عصبية @user',
    category: 'fun',

    async execute(sock, msg) {
        try {
            const groupJid = msg.key.remoteJid;
            const senderJid = msg.key.participant || msg.key.remoteJid;

            // الحصول على الشخص الممنشن إذا وُجد
            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
            const target = mentioned || senderJid;

            // توليد نسبة العصبية عشوائية
            const angerLevel = Math.floor(Math.random() * 101); // 0-100%

            // تحديد الرمز حسب النسبة
            let emoji = '';
            if (angerLevel <= 25) emoji = '😌';
            else if (angerLevel <= 50) emoji = '😐';
            else if (angerLevel <= 75) emoji = '😡';
            else emoji = '🤬';

            const text = mentioned
                ? `${emoji} مستوى عصبية @${target.split('@')[0]} هو: ${angerLevel}%`
                : `${emoji} مستوى عصبيتك هو: ${angerLevel}%`;

            await sock.sendMessage(groupJid, {
                text,
                mentions: mentioned ? [target] : []
            }, { quoted: msg });

        } catch (err) {
            console.error('❌ خطأ في أمر "عصبية":', err);
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ حصل خطأ:\n\n${err.message || err.toString()}`
            }, { quoted: msg });
        }
    }
};