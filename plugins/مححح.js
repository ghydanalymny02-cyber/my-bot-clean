const fs = require('fs');
const path = require('path');

module.exports = {
    command: 'مححح',
    description: 'إرسال بوسة طويلة مع شعر غزلي.',
    usage: '.بوسه [منشن أو رد على رسالة]',
    category: 'fun',

    async execute(sock, msg) {
        try {
            // تفاعل أولي
            await sock.sendMessage(msg.key.remoteJid, { react: { text: '🫦', key: msg.key } });

            const kissLines = [
                "🫦 موووووووواااااااااااااااااااااااحههههههههههه لك، عيونك تستاهل قبلاتي كلها هدولتي❤️",
                "🫦 مووووووااااااااااااااااااحههههه، أنت حياة لقلبي ودفى لروحي هدولتي💓",
                "🫦 مووووووااااااااااااااححححححح، كل بوسة مني لك هي وعد بالحب للأبد هدولتي💞",
                "🫦 موووووواااااااااااااحهههه، أنت السبب اللي يخلي قلبي يدق بسرعة هدولتي😘",
                "🫦 مووووووااااااااااححححح، أنت جنتي على الأرض هدولتي❤️",
                "🫦 موووووواااااااااااااحححح، ما أكتفي منك مهما حاولت هدولتي💋",
                "🫦 مووووووااااااااححححح، ريحتك تخليني أذوب أكتر من البوسة نفسها هدولتي💖",
                "🫦 مووووووااااااااححححح، كل بوسة لك فيها مليون إحساس هدولتي💓",
                "🫦 مووووووااااااااححححح، أنت أغلى وأجمل من أي شيء بالحياة هدولتي💗",
                "🫦 موووووواااااااححححح، أنت الحلم اللي ما أصحى منه أبدًا هدولتي😍"
            ];

            let targetJid = null;
            let quotedMessageId = null;

            // إذا رد على رسالة
            if (msg.message.extendedTextMessage?.contextInfo?.quotedMessage) {
                targetJid = msg.message.extendedTextMessage.contextInfo.participant;
                quotedMessageId = msg.message.extendedTextMessage.contextInfo.stanzaId;
            }
            // إذا منشن
            else if (msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
                targetJid = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
            } else {
                await sock.sendMessage(
                    msg.key.remoteJid,
                    { text: `❌ لازم تمنشن أو ترد على رسالة عشان أقدر أرسل البوسة 😏` },
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

            // اختيار بوسة عشوائية
            const randomKiss = kissLines[Math.floor(Math.random() * kissLines.length)];

            // إرسال
            if (quotedMessageId) {
                await sock.sendMessage(
                    msg.key.remoteJid,
                    { text: `${randomKiss}` },
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
                        text: `@${targetJid.split('@')[0]} ${randomKiss}`,
                        mentions: [targetJid]
                    },
                    { quoted: msg }
                );
            }

        } catch (error) {
            console.error('❌ خطأ في أمر "بوسه":', error);
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ صار خطأ: ${error.message || error.toString()}`
            }, { quoted: msg });
        }
    }
};