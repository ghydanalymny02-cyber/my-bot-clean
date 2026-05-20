const fs = require('fs');
const path = require('path');

module.exports = {
  command: 'زوجنا',
  description: '💍 يزوّجك من شخص مع صورة + استمارة مزخرفة وشعر حب',
  usage: '.زواج @منشن',
  category: 'ترفيه',

  async execute(sock, msg) {
    let targetJid;

    // التحقق إذا فيه منشن
    if (
      msg.message?.extendedTextMessage?.contextInfo?.mentionedJid &&
      msg.message.extendedTextMessage.contextInfo.mentionedJid.length > 0
    ) {
      targetJid = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
    } else {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "منشن الشخص اللي تبي تتزوجه 💍"
      }, { quoted: msg });
    }

    const senderJid = msg.key.participant || msg.key.remoteJid;
    const senderId = senderJid.split('@')[0];
    const targetId = targetJid.split('@')[0];

    // عبارات شعر حب
    const poems = [
      "💖 أنت قدري الجميل ونصفي الآخر.",
      "🌹 في عيونك لقيت أوطاني وأماني.",
      "✨ حبك بقلبي مثل النجوم ما يغيب.",
      "💞 كل العمر ما يسوى لحظة بحضورك.",
      "🔥 قلبك هو الوطن اللي أبي أسكن فيه.",
    ];
    const poem = poems[Math.floor(Math.random() * poems.length)];

    // الاستمارة المزخرفة
    const marriageForm = `
╔═══════════════ 💍 ═══════════════╗
        ✨ *عقد زواج أسطوري* ✨
╚═══════════════ 💍 ═══════════════╝

🤵 *العريس:* @${senderId}  
👰 *العروس:* @${targetId}  

📜 *بمباركة البوت العظيم:*  
🌋𝒀𝑼𝑴𝑰𝑳𝑨⊰𝑩𝑶𝑻 ♔ 🕊️

🖋️ *القَسَم:*  
سأكون لك حباً ووفاءً ما دام القلب ينبض ❤️  

💌 *𝑮𝑶𝑱𝑶:*  
"${poem}"

🎊 ألف مبروك للزوجين.. حياة مليئة بالحب والسعادة 💞
`;

    // تحميل الصورة
    const imgPath = path.join(process.cwd(), 'resources/zawaj.jpg');
    if (!fs.existsSync(imgPath)) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ الصورة غير موجودة. حط ملف باسم zawaj1.jpg في مجلد البوت.'
      }, { quoted: msg });
    }

    const imageBuffer = fs.readFileSync(imgPath);

    // إرسال الصورة مع الاستمارة
    await sock.sendMessage(msg.key.remoteJid, {
      image: imageBuffer,
      caption: marriageForm,
      mentions: [senderJid, targetJid]
    }, { quoted: msg });
  }
};