module.exports = {
    command: 'ضغط',
    description: 'يعطي ضغط دم عشوائي للشخص الممنشن أو لك إذا لم يتم المنشن مع تقييم بصري',
    usage: '.ضغط @user',
    category: 'fun',

    async execute(sock, msg) {
        try {
            const groupJid = msg.key.remoteJid;
            const senderJid = msg.key.participant || msg.key.remoteJid;

            // الحصول على الشخص الممنشن إذا وُجد
            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
            const target = mentioned || senderJid;

            // توليد ضغط دم عشوائي
            const systolic = Math.floor(Math.random() * (140 - 90 + 1)) + 90; // 90-140
            const diastolic = Math.floor(Math.random() * (90 - 60 + 1)) + 60;  // 60-90

            // تحديد الرمز حسب الضغط
            let emoji = '';
            if (systolic <= 120 && diastolic <= 80) emoji = '🟢';
            else if (systolic <= 129 && diastolic <= 84) emoji = '🟡';
            else if (systolic <= 139 && diastolic <= 89) emoji = '🟠';
            else emoji = '🔴';

            const text = mentioned
                ? `${emoji} ضغط الدم الحالي لـ @${target.split('@')[0]} هو: ${systolic}/${diastolic} mmHg`
                : `${emoji} ضغط دمك الحالي هو: ${systolic}/${diastolic} mmHg`;

            await sock.sendMessage(groupJid, {
                text,
                mentions: mentioned ? [target] : []
            }, { quoted: msg });

        } catch (err) {
            console.error('❌ خطأ في أمر "ضغط":', err);
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ حصل خطأ:\n\n${err.message || err.toString()}`
            }, { quoted: msg });
        }
    }
};