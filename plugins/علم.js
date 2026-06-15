const fs = require('fs');
const path = require('path');

// إعداد ملف النقاط
const pointsFile = path.join(__dirname, '../data/points.json');
let points = fs.existsSync(pointsFile) ? JSON.parse(fs.readFileSync(pointsFile)) : {};

function savePoints() {
    fs.writeFileSync(pointsFile, JSON.stringify(points, null, 2));
}

// قائمة الدول مرتبة ومنظمة
const countries = [
    { name: "مصر", flag: "🇪🇬" }, { name: "السعودية", flag: "🇸🇦" }, { name: "فلسطين", flag: "🇵🇸" },
    { name: "الجزائر", flag: "🇩🇿" }, { name: "المغرب", flag: "🇲🇦" }, { name: "تونس", flag: "🇹🇳" },
    { name: "لبنان", flag: "🇱🇧" }, { name: "الأردن", flag: "🇯🇴" }, { name: "الإمارات", flag: "🇦🇪" },
    { name: "البحرين", flag: "🇧🇭" }, { name: "الكويت", flag: "🇰🇼" }, { name: "قطر", flag: "🇶🇦" },
    { name: "عُمان", flag: "🇴🇲" }, { name: "العراق", flag: "🇮🇶" }, { name: "سوريا", flag: "🇸🇾" },
    { name: "اليمن", flag: "🇾🇪" }, { name: "ليبيا", flag: "🇱🇾" }, { name: "السودان", flag: "🇸🇩" },
    { name: "موريتانيا", flag: "🇲🇷" }, { name: "الصومال", flag: "🇸🇴" }, { name: "جيبوتي", flag: "🇩🇯" },
    { name: "جزر القمر", flag: "🇰🇲" }, { name: "تركيا", flag: "🇹🇷" }, { name: "إيران", flag: "🇮🇷" },
    { name: "اليابان", flag: "🇯🇵" }, { name: "الصين", flag: "🇨🇳" }, { name: "كوريا الجنوبية", flag: "🇰🇷" },
    { name: "روسيا", flag: "🇷🇺" }, { name: "فرنسا", flag: "🇫🇷" }, { name: "ألمانيا", flag: "🇩🇪" },
    { name: "إيطاليا", flag: "🇮🇹" }, { name: "إسبانيا", flag: "🇪🇸" }, { name: "بريطانيا", flag: "🇬🇧" },
    { name: "البرتغال", flag: "🇵🇹" }, { name: "الارجنتين", flag: "🇦🇷" }, { name: "البرازيل", flag: "🇧🇷" },
    { name: "أمريكا", flag: "🇺🇸" }, { name: "كندا", flag: "🇨🇦" }, { name: "المكسيك", flag: "🇲🇽" },
    { name: "هولندا", flag: "🇳🇱" }, { name: "بلجيكا", flag: "🇧🇪" }, { name: "سويسرا", flag: "🇨🇭" },
    { name: "الهند", flag: "🇮🇳" }, { name: "باكستان", flag: "🇵🇰" }, { name: "أندونيسيا", flag: "🇮🇩" },
    { name: "ماليزيا", flag: "🇲🇾" }, { name: "أستراليا", flag: "🇦🇺" }, { name: "السنغال", flag: "🇸🇳" },
    { name: "نيجيريا", flag: "🇳🇬" }, { name: "الكاميرون", flag: "🇨🇲" }, { name: "غانا", flag: "🇬🇭" },
    { name: "كرواتيا", flag: "🇭🇷" }, { name: "الأوروغواي", flag: "🇺🇾" }, { name: "كولومبيا", flag: "🇨🇴" }
];

const activeGames = {};

module.exports = {
    command: 'علم',
    category: "🎮 الألعاب",
    description: "🌍 خمن الدولة من العلم واحصل على نقطة",
    
    async execute(sock, m) {
        const chatId = m.key.remoteJid;
        const sender = m.key.participant || m.key.remoteJid;

        // منع تكرار اللعبة في نفس المحادثة
        if (activeGames[chatId]) {
            return sock.sendMessage(chatId, { text: '⚠️ هناك لعبة قائمة بالفعل!' }, { quoted: m });
        }

        const randomCountry = countries[Math.floor(Math.random() * countries.length)];
        const correctAnswer = randomCountry.name.trim().toLowerCase();

        // إرسال سؤال اللعبة
        await sock.sendMessage(chatId, {
            text: `•⪼ ⸽ فــعــالـية˼✒️˹ خمن الدولة\n*❐─━──━〘•🕸️•〙━──━─❐*\n*˼🕸️˹⥃الــعـلــم﹝ ${randomCountry.flag}﹞*\n*˼🕸️˹⥃الوقت﹝30 ثانية﹞*\n*❐─━──━〘•🕸️•〙━──━─❐*\n*مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 𝑩𝑶𝑻 ❄️*`
        }, { quoted: m });

        // تعريف مستمع الرسائل
        const handler = async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message || msg.key.remoteJid !== chatId) return;

            const text = (msg.message.conversation || msg.message.extendedTextMessage?.text || '').trim().toLowerCase();
            
            if (text === correctAnswer) {
                // تنظيف الأحداث عند الفوز
                sock.ev.off('messages.upsert', handler);
                clearTimeout(timeoutId);

                points[sender] = (points[sender] || 0) + 1;
                savePoints();

                await sock.sendMessage(chatId, {
                    text: `*❐─━──━〘•🕸️•〙━──━─❐*\n*˼🕸️˹⥃الــدولة﹝ ${randomCountry.name}﹞*\n*˼🕸️˹⥃الــفــائــز﹝@${sender.split('@')[0]}﹞*\n*˼🕸️˹⥃النقاط﹝${points[sender]}﹞*\n*❐─━──━〘•🕸️•〙━──━─❐*\n*مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 𝑩𝑶𝑻 ❄️*`,
                    mentions: [sender]
                }, { quoted: msg });

                delete activeGames[chatId];
            }
        };

        // تفعيل المستمع
        sock.ev.on('messages.upsert', handler);
        activeGames[chatId] = { finished: false };

        // مؤقت انتهاء الوقت
        const timeoutId = setTimeout(() => {
            if (activeGames[chatId]) {
                sock.ev.off('messages.upsert', handler);
                sock.sendMessage(chatId, { text: `*❐─━──━〘•🕸️•〙━──━─❐*\n⌛ انتهى الوقت!\n❌ الإجابة الصحيحة: ${randomCountry.name}\n*❐─━──━〘•🕸️•〙━──━─❐*` });
                delete activeGames[chatId];
            }
        }, 30000);
    }
};
