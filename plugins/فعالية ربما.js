const fs = require('fs');
const path = require('path');

module.exports = {
    status: "on",
    name: 'تحدي عشوائي',
    command: ['ربما'],
    category: 'fun',
    description: 'إرسال تحديات مسلية مع ردود عشوائية',
    hidden: false,
    version: '1.0',

    async execute(sock, msg) {
        try {
            // قائمة بالتحديات
            const challenges = [
                "ما هو الشيء الذي يمشي بلا أرجل؟",
                "ما الشيء الذي كلما أخذت منه كبر؟",
                "ما الذي له أوراق وليس بنبات؟",
                "ما الشيء الذي يخترق الزجاج ولا يكسره؟",
                "ما الذي يمكنك كسره دون لمسه؟"
            ];

            // قائمة بالردود العشوائية (ليست جميعها صحيحة!)
            const funnyResponses = [
                "الجواب: 🕰️ الوقت! (أو ربما 🐌 الحلزون؟)",
                "الجواب: 🔍 الثقب! (أو ممكن يكون 👵 العمر؟)",
                "الجواب: 📚 الكتاب! (أو ربما 💵 المال؟)",
                "الجواب: 🌞 الضوء! (أو يمكن 👃 الرائحة؟)",
                "الجواب: 🤫 الصمت! (أو ربما 💔 القلب؟)"
            ];

            // اختيار عشوائي
            const randomIndex = Math.floor(Math.random() * challenges.length);
            const challenge = challenges[randomIndex];
            const response = funnyResponses[randomIndex];

            // إرسال التحدي أولاً
            await sock.sendMessage(msg.key.remoteJid, { 
                text: `🎲 *تحدي اليوم:*\n\n${challenge}\n\nفكر جيداً...` 
            }, { quoted: msg });

            // انتظر 5 ثواني ثم أرسل الرد
            setTimeout(async () => {
                await sock.sendMessage(msg.key.remoteJid, { 
                    text: `⚡ *الإجابة:*\n\n${response}\n\n😆 هل كنت تعرفها؟` 
                }, { quoted: msg });
            }, 5000);

        } catch (error) {
            console.error('❌ Error:', error);
            await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ حدث خطأ في توليد التحدي!'
            }, { quoted: msg });
        }
    }
};