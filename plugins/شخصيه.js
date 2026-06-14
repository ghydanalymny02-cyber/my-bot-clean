const fs = require('fs');
const path = require('path');

module.exports = {
  command: 'خمن',
  description: 'خمن اسم شخصية الأنمي من الصورة خلال 25 ثانية!',
  category: 'ألعاب',

  async execute(sock, msg, args) {
    const animeDir = path.join(__dirname, '../media/anime');
    const files = fs.readdirSync(animeDir).filter(f => /\.(jpe?g|png)$/i.test(f));
    if (!files.length) {
      return sock.sendMessage(msg.key.remoteJid, { text: '❌ لا توجد صور في مجلد الأنمي.' }, { quoted: msg });
    }

    const randomFile = files[Math.floor(Math.random() * files.length)];
    const correctAnswer = path.basename(randomFile, path.extname(randomFile)).toLowerCase();
    const imageBuffer = fs.readFileSync(path.join(animeDir, randomFile));
    const chatId = msg.key.remoteJid;

    const caption = `
⏳ ❖︙تحدي جديد لمحبي الأنمي!
🧠 ❖︙هل تستطيع تخمين الشخصية التي في الصورة؟
📸 ❖︙أنظر جيدًا، لديك فقط *25 ثانية*!

💡 ❖︙أكتب اسم الشخصية الآن في الشات.

⌛ ❖︙أول من يجيب بشكل صحيح يفوز 🎉

━━━━━━━━━━━━━━━
👑︙المطور : 𝒀𝑼𝑴𝑰𝑳𝑨
🧪︙البوت : 𝒀𝑼𝑴𝑰𝑳𝑨 𝑩𝑶𝑻
━━━━━━━━━━━━━━━`.trim();

    await sock.sendMessage(chatId, {
      image: imageBuffer,
      caption
    }, { quoted: msg });

    let answered = false;

    const handler = async ({ messages }) => {
      const reply = messages[0];
      const body = reply.message?.conversation || reply.message?.extendedTextMessage?.text;
      const from = reply.key.remoteJid;

      if (from !== chatId || reply.key.fromMe) return;

      if (body?.trim().toLowerCase() === correctAnswer) {
        answered = true;
        await sock.sendMessage(chatId, {
          text: `✅ إجابة صحيحة! الشخصية هي: *${correctAnswer}*`
        }, { quoted: reply });
        sock.ev.off('messages.upsert', handler);
      }
    };

    sock.ev.on('messages.upsert', handler);

    setTimeout(() => {
      if (!answered) {
        sock.sendMessage(chatId, {
          text: `❌ انتهى الوقت! الإجابة الصحيحة كانت: *${correctAnswer}*`
        }, { quoted: msg });
        sock.ev.off('messages.upsert', handler);
      }
    }, 25000);
  }
};