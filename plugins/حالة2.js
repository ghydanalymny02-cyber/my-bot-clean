module.exports = {
    command: 'حالة2',
    category: 'tools',
    async execute(sock, msg) {
        try {
            const chatId = msg.key.remoteJid;

            const generateStatus = () => {
                const uptimeSeconds = process.uptime();
                const hours = Math.floor(uptimeSeconds / 3600);
                const minutes = Math.floor((uptimeSeconds % 3600) / 60);
                const seconds = Math.floor(uptimeSeconds % 60);
                const uptimeFormatted = `${hours}h ${minutes}m ${seconds}s`;

                const now = new Date();
                const currentTime = now.toLocaleString('ar-EG', { hour12: false });
                const ping = Date.now() - msg.messageTimestamp * 1000;

                return `
❴✾❵──━━━━❨🫦❩━━━━──❴✾❵

     ♛ *حالة البوت* ♛
❴✾❵──━━━━❨🌋❩━━━━──❴✾❵
*🔋 الحالة: احسن منك 🫦*
*🏓 السرعة: ${ping}ms*
*♛  المطور: مـــجـــهـــول*
*⌚ مدة التشغيل: ${uptimeFormatted}*
*⏳ الوقت الحالي: ${currentTime}*

*هات الاوامر سرييع ⚡*
مـــجـــهـــول ⊰𝑩𝑶𝑻 🌋
❴✾❵──━━━━❨☀️❩━━━━──❴✾❵

                `.trim();
            };

            await sock.sendMessage(chatId, {
                text: generateStatus(),
                buttons: [
                    { buttonId: 'حالة', buttonText: { displayText: '🔄 تحديث الحالة' }, type: 1 }
                ],
                headerType: 1
            });

        } catch (error) {
            console.error('❌ خطأ في كود حالة البوت:', error);
            await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ حدث خطأ أثناء جلب حالة البوت، حاول لاحقًا.'
            });
        }
    }
};
