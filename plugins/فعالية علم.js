const fs = require('fs');
const path = require('path');

const pointsFile = path.join(__dirname, '../data/points.json');
let points = fs.existsSync(pointsFile) ? JSON.parse(fs.readFileSync(pointsFile)) : {};

function savePoints() {
  fs.writeFileSync(pointsFile, JSON.stringify(points, null, 2));
}

const countries = [
  { name: "مصر", flag: "🇪🇬" }, { name: "السعودية", flag: "🇸🇦" }, { name: "فلسطين", flag: "🇵🇸" },
  { name: "الجزائر", flag: "🇩🇿" }, { name: "المغرب", flag: "🇲🇦" }, { name: "تونس", flag: "🇹🇳" },
  { name: "لبنان", flag: "🇱🇧" }, { name: "الأردن", flag: "🇯🇴" }, { name: "الإمارات", flag: "🇦🇪" },
  { name: "البحرين", flag: "🇧🇭" }, { name: "الكويت", flag: "🇰🇼" }, { name: "قطر", flag: "🇶🇦" },
  { name: "عمان", flag: "🇴🇲" }, { name: "العراق", flag: "🇮🇶" }, { name: "سوريا", flag: "🇸🇾" },
  { name: "اليمن", flag: "🇾🇪" }, { name: "ليبيا", flag: "🇱🇾" }, { name: "السودان", flag: "🇸🇩" },
  { name: "موريتانيا", flag: "🇲🇷" }, { name: "الصومال", flag: "🇸🇴" }, { name: "جيبوتي", flag: "🇩🇯" },
  { name: "جزر القمر", flag: "🇰🇲" }, { name: "تركيا", flag: "🇹🇷" }, { name: "إيران", flag: "🇮🇷" },
  { name: "فرنسا", flag: "🇫🇷" }, { name: "ألمانيا", flag: "🇩🇪" }, { name: "إيطاليا", flag: "🇮🇹" },
  { name: "إسبانيا", flag: "🇪🇸" }, { name: "بريطانيا", flag: "🇬🇧" }, { name: "روسيا", flag: "🇷🇺" },
  { name: "الصين", flag: "🇨🇳" }, { name: "اليابان", flag: "🇯🇵" }, { name: "كوريا الجنوبية", flag: "🇰🇷" },
  { name: "الهند", flag: "🇮🇳" }, { name: "باكستان", flag: "🇵🇰" }, { name: "أمريكا", flag: "🇺🇸" },
  { name: "كندا", flag: "🇨🇦" }, { name: "البرازيل", flag: "🇧🇷" }, { name: "الأرجنتين", flag: "🇦🇷" },
  { name: "أستراليا", flag: "🇦🇺" }, { name: "نيوزيلندا", flag: "🇳🇿" }, { name: "جنوب أفريقيا", flag: "🇿🇦" },
  { name: "المكسيك", flag: "🇲🇽" }, { name: "اليونان", flag: "🇬🇷" }, { name: "السويد", flag: "🇸🇪" },
  { name: "النرويج", flag: "🇳🇴" }, { name: "سويسرا", flag: "🇨🇭" }, { name: "النمسا", flag: "🇦🇹" },
  { name: "بلجيكا", flag: "🇧🇪" }, { name: "هولندا", flag: "🇳🇱" }, { name: "البرتغال", flag: "🇵🇹" },
  { name: "ماليزيا", flag: "🇲🇾" }, { name: "إندونيسيا", flag: "🇮🇩" }, { name: "تايلاند", flag: "🇹🇭" },
  { name: "فيتنام", flag: "🇻🇳" }, { name: "الفلبين", flag: "🇵🇭" }, { name: "نيجيريا", flag: "🇳🇬" },
  { name: "كينيا", flag: "🇰🇪" }, { name: "إثيوبيا", flag: "🇪🇹" }, { name: "كولومبيا", flag: "🇨🇴" }
];

const activeGames = {};

module.exports = {
  command: 'علم',
  category: "🎮 الألعاب",
  description: "🌍 خمن الدولة من العلم واحصل على نقطة",
  async execute(sock, m) {
    const chatId = m.key.remoteJid;
    if (activeGames[chatId]) return sock.sendMessage(chatId, { text: '⚠️ هناك لعبة قائمة بالفعل!' }, { quoted: m });

    const randomCountry = countries[Math.floor(Math.random() * countries.length)];
    const correctAnswer = randomCountry.name.trim().toLowerCase();

    await sock.sendMessage(chatId, {
      text: `•⪼ ⸽ فــعــالـية خمن الدولة 🌍\n\nالـعـلــم ﹝ ${randomCountry.flag} ﹞\nالوقت: 30 ثانية`
    }, { quoted: m });

    activeGames[chatId] = { answer: correctAnswer, finished: false };

    // استخدام setTimeout لإنهاء اللعبة
    setTimeout(() => {
      if (activeGames[chatId] && !activeGames[chatId].finished) {
        sock.sendMessage(chatId, { text: `⌛ انتهى الوقت! الإجابة الصحيحة كانت: ${randomCountry.name}` });
        delete activeGames[chatId];
      }
    }, 30000);
  }
};
