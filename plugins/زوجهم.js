const fs = require('fs');
const path = require('path');

module.exports = {
  command: ['زوجهم'],
  description: '💍 يزوّج الشخصين الذين تم منشنهم مع بعض (نفس الاستمارة المزخرفة)',
  usage: '.زوجوهم @شخص1 @شخص2',
  category: 'ترفيه',

  async execute(sock, msg) {

    const mentions = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;

    if (!mentions || mentions.length < 2) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "❗ لازم تمنشن **شخصين** ليتم تزويجهما 💍\nمثال:\n`.زوجوهم @x @y`"
      }, { quoted: msg });
    }

    const person1 = mentions[0];
    const person2 = mentions[1];

    const id1 = person1.split("@")[0];
    const id2 = person2.split("@")[0];

    // شعر الحب
    const poems = [
      "💖 أنت قدري الجميل ونصفي الآخر.",
      "🌹 في عيونك لقيت أوطاني وأماني.",
      "✨ حبكم مثل ضوّ القمر.. ما يغيب.",
      "💞 قلوبكم كُتِب لها أن تلتقي للأبد.",
      "🔥 روحين.. جمعهم القدر بحب ما ينتهي."
    ];

    const poem = poems[Math.floor(Math.random() * poems.length)];

    // الاستمارة نفسها 100%
    const marriageForm = `
═══════════════ 
✨ *عقد زواج أسطوري* ✨
═══════════════

🤵 *العريس:* @${id1}  
👰 *العروس:* @${id2}  

📜 *بمباركة البوت العظيم:*  
🌋مـــجـــهـــول⊰𝑩𝑶𝑻 ♔ 🕊️

🖋️ *القَسَم:*  
سأكون لك حباً ووفاءً ما دام القلب ينبض ❤️  

💌 *العريس:*  
"${poem}"

🎊 ألف مبروك للزوجين.. حياة مليئة بالحب والسعادة 💞
مـــجـــهـــول⊰𝑩𝑶𝑻 🌋`;

    // تحميل نفس الصورة
    const imgPath = path.join(process.cwd(), 'resources/zog.jpg');
    if (!fs.existsSync(imgPath)) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ الصورة غير موجودة.\nحط ملف باسم **zawaj1.jpg** في مجلد البوت.'
      }, { quoted: msg });
    }

    const imageBuffer = fs.readFileSync(imgPath);

    await sock.sendMessage(msg.key.remoteJid, {
      image: imageBuffer,
      caption: marriageForm,
      mentions: [person1, person2]
    }, { quoted: msg });
  }
};