module.exports = {
    command: 'زوجي',
    description: 'يتم منشن المستخدم إذا ذكر أحد كلمة "مطور"',
    category: 'auto',

    async execute(sock, msg) {
        try {
            // جلب النص من أي نوع رسالة نصية
            const text = msg.message?.conversation 
                         || msg.message?.extendedTextMessage?.text
                         || msg.message?.imageMessage?.caption
                         || msg.message?.videoMessage?.caption;

            if (!text) return;

            // تحقق من وجود كلمة "مطور"
            if (text.includes('زوجي')) {
                const myJid = '963996097873'; // ضع رقمك هنا

                await sock.sendMessage(msg.key.remoteJid, {
                    text: `تم استدعائي من طرف *زوجتي* امممم ثواني جاي يعمري 💓
 مـــجـــهـــول⊰𝑩𝑶𝑻 ❄`,
                    mentions: [myJid]
                });
            }
        } catch (err) {
            console.log('حدث خطأ:', err);
        }
    }
};