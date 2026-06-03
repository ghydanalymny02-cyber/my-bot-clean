const fs = require('fs');
const path = require('path');

module.exports = {
    command: 'تعالي',
    description: 'إرسال تحرش ساخن لشخص تم منشنه أو الرد عليه.',
    usage: '.ر [منشن أو رد على رسالة]',
    category: 'fun',

    async execute(sock, msg) {
        try {
            await sock.sendMessage(msg.key.remoteJid, { react: { text: '🫦', key: msg.key } });

            const flirtLines = [
                "🫦 تعال أقرب، خليك في حضني شوي.",
                "🫦 لو تعرف قد إيش أنت فاتن، كنت حرقت الدنيا عليّ.",
                "🫦 كل ما شفتك، حسيت الدنيا صارت أدفى.",
                "🫦 تعال خليني أضيع بعيونك شوي.",
                "🫦 قرب لا أقول كلام يدوّخك.",
                "🫦 أنت مش بس حلو… أنت وجع حلو.",
                "🫦 شفايفك تنادي على شفايفي.",
                "🫦 لو كنت جمبي الحين، كان صار شيء مجنون.",
                "🫦 ضحكتك تسكرني أكثر من أي مشروب.",
                "🫦 قرب وخليني أسرح فيك أكثر.",
                "🫦 أنت فتنة تمشي على الأرض.",
                "🫦 يا حظ المخدة اللي تاخذ حضنك.",
                "🫦 ملامحك جريمة جمال.",
                "🫦 أحس حضنك أدفى من أي شتاء.",
                "🫦 كل مرة أشوفك… قلبي يخونني.",
                "🫦 قرب، يمكن ألمس قلبك قبل يدك.",
                "🫦 حضورك يغويني أكثر من أي شيء.",
                "🫦 ما أكتفي من نظراتك.",
                "🫦 أنت أكبر ذنب أتمنى أعيشه.",
                "🫦 حتى أنفاسي تتسارع إذا كنت قريب.",
                "🫦 قرب لا أبتلعك بنظراتي.",
                "🫦 ما فيك شي ما يفتن.",
                "🫦 أحس لمستك تكهربني.",
                "🫦 تعال، خليني أذوب فيك شوي.",
                "🫦 أنت سبب كل ارتباكي.",
                "🫦 شفايفك تخليني أنسى الدنيا.",
                "🫦 لو حضنتك… ما أفكك.",
                "🫦 ريحتك جنون.",
                "🫦 أنت كل رغباتي مجتمعة.",
                "🫦 قرب، خليني أضيع فيك.",
                "🫦 ضحكتك تحرق أعصابي.",
                "🫦 ملامحك تلعب في خيالي.",
                "🫦 أنت فتنة بكل تفاصيلك.",
                "🫦 قرب، يمكن نولع الدنيا.",
                "🫦 حتى صوتك يغويني.",
                "🫦 عيونك تخلي قلبي ينفضح.",
                "🫦 أنت نار وأنا أحب الاحتراق.",
                "🫦 قرب وخلي الباقي علي.",
                "🫦 لمستك حلم مستحيل أفيق منه.",
                "🫦 أنت سحر وأنا مغلوب فيه."
            ];

            let targetJid = null;
            let quotedMessageId = null;

            if (msg.message.extendedTextMessage?.contextInfo?.quotedMessage) {
                targetJid = msg.message.extendedTextMessage.contextInfo.participant;
                quotedMessageId = msg.message.extendedTextMessage.contextInfo.stanzaId;
            } else if (msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
                targetJid = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
            } else {
                await sock.sendMessage(
                    msg.key.remoteJid,
                    { text: `❌ لازم تمنشن أو ترد على رسالة عشان أقدر أرسل التحرش🫦🤤` },
                    { quoted: msg }
                );
                return;
            }

            if (!targetJid) {
                await sock.sendMessage(
                    msg.key.remoteJid,
                    { text: `❌ ما قدرت أحدد الشخص، جرب تمنشنه أو ترد عليه.` },
                    { quoted: msg }
                );
                return;
            }

            const randomFlirt = flirtLines[Math.floor(Math.random() * flirtLines.length)];

            if (quotedMessageId) {
                await sock.sendMessage(
                    msg.key.remoteJid,
                    { text: `*${randomFlirt}*
𝑬𝑺𝑪𝑨𝑵𝑶𝑹⊰𝑩𝑶𝑻 🌋` },
                    { quoted: {
                        key: {
                            remoteJid: msg.key.remoteJid,
                            id: quotedMessageId,
                            participant: targetJid
                        },
                        message: { conversation: "Original Message" }
                    }}
                );
            } else {
                await sock.sendMessage(
                    msg.key.remoteJid,
                    { 
                        text: `@${targetJid.split('@')[0]} ${randomFlirt}
𝑬𝑺𝑪𝑨𝑵𝑶𝑹⊰𝑩𝑶𝑻 🌋`,
                        mentions: [targetJid]
                    },
                    { quoted: msg }
                );
            }

        } catch (error) {
            console.error('❌ خطأ في أمر "ر":', error);
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ صار خطأ: ${error.message || error.toString()}`
            }, { quoted: msg });
        }
    }
};