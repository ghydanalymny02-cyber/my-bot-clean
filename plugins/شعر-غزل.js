const fs = require('fs');
const path = require('path');

module.exports = {
    status: "on",
    name: 'شعر غزل',
    command: ['شعر'],
    category: 'fun',
    description: 'إرسال أبيات غزلية عشوائية',
    hidden: false,
    version: '1.1',

    async execute(sock, msg) {
        try {
            // 🩷 قائمة الأبيات الغزلية
            const ghazalPoems = [
                "أحبك كالطفل يحب أمه ✦ وأهواك كالعاشق المسكين",
                "عيناك يا حبيبي بحر من الشوق ✦ وقلبك عندي أغلى من كل شيء",
                "لو كنت بدري ما تركتك للقمر ✦ ولا رضيت بغيرك لي زينة وحلى",
                "يا حبيبي أنت القمر بين النجوم ✦ وأنت النور في ظلمة ليالي",
                "أغار عليك من نظرة العيون ✦ وأخاف عليك من شمس الظهيرة",
                "حبك في قلبي مثل النبض ✦ لا يسكن ولا يهدأ ولا ينتهي",
                "لو الدنيا تطلب فداءً لك ✦ قدمت روحي وقلبي فداء",
                "عيونك سحر ونظراتك غزل ✦ وقلبك عندي دنياي وما فيها",
                "أحبك أكثر مما تتخيل ✦ وأكثر مما تعرف وأكثر مما ترى",
                "أنت القصيدة التي أعجز عن كتابتها ✦ وأنت الحلم الذي لا أريد أن أصحو منه",
                "حبي لك كالسماء واسع ✦ وكالبحر عميق وكالنجوم لا يُحصى",
                "لو كل الناس تنسى حبك ✦ أنا آخر واحد سيتذكّر"
            ];

            // 🌹 اختيار بيت غزلي عشوائي
            const randomPoem = ghazalPoems[Math.floor(Math.random() * ghazalPoems.length)];

            // 🖼️ تحميل الصورة إن وُجدت
            const thumbPath = path.join(process.cwd(), 'media', 'love.jpg');
            const thumbnail = fs.existsSync(thumbPath) ? fs.readFileSync(thumbPath) : null;

            // 💬 إرسال الرسالة مع زر
            await sock.sendMessage(msg.key.remoteJid, {
                text: `💞 *شِعْر غَزَلِيّ* 💞\n\n💬 ${randomPoem}\n\n🌸 _من روائع الشاعر العربي اسكانور_`,
                footer: "اضغط الزر للحصول على بيت غزلي آخر 💌",
                buttons: [
                    {
                        buttonId: 'شعر-غزل',
                        buttonText: { displayText: '💌 شِعر آخر' },
                        type: 1
                    }
                ],
                headerType: 4,
                contextInfo: {
                    externalAdReply: {
                        title: "الشاعر اسكانور",
                        body: "أجمل الأبيات الغزلية 💕",
                        thumbnail,
                        mediaType: 1
                    }
                }
            }, { quoted: msg });

        } catch (error) {
            console.error('❌ Error in ghazal command:', error);
            await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ حدث خطأ أثناء جلب الشعر، حاول مرة أخرى لاحقاً'
            }, { quoted: msg });
        }
    }
};