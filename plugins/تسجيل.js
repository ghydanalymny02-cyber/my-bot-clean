const fs = require("fs");
const path = require("path");

let images = ["sukuna_login", "sukuna_power", "sukuna_smile"];

function getRandomImagePath() {
  const name = images[Math.floor(Math.random() * images.length)];
  const imgPath = path.join(__dirname, `../media/registration/${name}.jpg`);
  return fs.existsSync(imgPath) ? imgPath : null;
}

module.exports = {
  command: ["تسجيل"],
  category: "fun",
  description: "تسجيل دخول بأسلوب مـــجـــهـــول 😈 مع صور متغيرة",

  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;

    const responses = [
      "😈 تم تسجيل الدخول بنجاح! مـــجـــهـــول يشهد على دخولك 🔥",
      "👑 مرحباً بك في عالم مـــجـــهـــول قوة وجبروت ينتظرانك! 💀",
      "💀 حذارِ، لقد دخلت وبدأت رحلة مليئة بالتحديات! ⚔️",
      "🔥 نقاط القوة تسجل باسمك... اهلاً بك أيها المحارب! ❤️",
    ];

    const reply = responses[Math.floor(Math.random() * responses.length)];
    const imagePath = getRandomImagePath();

    const message = imagePath
      ? { image: { url: imagePath }, caption: reply }
      : { text: reply };

    await sock.sendMessage(chatId, message, { quoted: msg });
  },
};