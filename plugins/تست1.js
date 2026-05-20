const fs = require('fs');

module.exports = {
  command: 'تست1',
  description: 'رد فخم عند كتابة "تست"',
  group: true,

  async execute(sock, msg) {
    const videoPath = 'resources/escanor.mp4';

    // تحقق من وجود الفيديو
    if (!fs.existsSync(videoPath)) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '⚠️ لم يتم العثور على الفيديو escanor.mp4.',
      }, { quoted: msg });
    }

    // أرسل الفيديو مع الرسالة
    await sock.sendMessage(msg.key.remoteJid, {
      video: fs.readFileSync(videoPath),
      caption: `*نحن لا نتعب… نحن ننتظࢪ…*\n*نصنـ؏ المشهد، نضبط الأضاءة، ونتࢪڪك تدخل المشهد لحالك..*
*𝒀𝑼𝑴𝑰𝑳𝑨⊰𝑩𝑶𝑻* ❄`,
    }, { quoted: msg });
  }
};
