// *حقوق مطور يوميلا 🛡*
// 📄 مراوغة.js

const path = require('path');
const fs = require('fs');

module.exports = {
  command: ['مراوغة'],
  description: 'فيديو + صوت + مدح لرونالدو + رسالة خاصة',
  category: 'معلومات',

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;
    const botJid = sock.user.id;

    // 🗂️ مسار الفيديو Cristiano.mp4 داخل resources
    const videoPath = path.join(__dirname, '../resources/Cristiano.mp4');

    // 🗂️ مسار الصوت Ronaldo.mp3 داخل /storage/emulated/0/bot/sounds/
    const soundPath = path.join('/storage/emulated/0/bot/sounds/', 'Ronaldo.mp3');

    // ✨ مدح لرونالدو
    const praise = `
╔══════════════════════════════════════╗
     ⚽🔥 𝐂𝐑𝐈𝐒𝐓𝐈𝐀𝐍𝐎 𝐑𝐎𝐍𝐀𝐋𝐃𝐎 🔥⚽
╚══════════════════════════════════════╝

🌟 الأسطورة التي لا تُقارن  
💪 قائد بالفكر والجسد، رمز القوة والعزيمة  
⚡ كل لمسة منه تصنع التاريخ  
👑 كريستيانو رونالدو… الفخامة بعينها
    `.trim();

    try {
      // 🎥 إرسال الفيديو مع المدح
      await sock.sendMessage(jid, {
        video: { url: videoPath },
        caption: praise
      }, { quoted: msg });

      // 🎵 إرسال الصوت Ronaldo.mp3 مع المدح
      await sock.sendMessage(jid, {
        audio: fs.readFileSync(soundPath),
        mimetype: 'audio/mp4',
        fileName: 'Ronaldo.mp3',
        caption: praise
      }, { quoted: msg });

      // 📝 رسالة خاصة
      await sock.sendMessage(jid, {
        text: '⚽🔥 رونالدو لا تقارنه بميسي فهو لا يقارن 🔥⚽'
      }, { quoted: msg });

    } catch (error) {
      console.error('💥 خطأ رئيسي في مراوغة.js:', error);
      await sock.sendMessage(jid, {
        text: `❌ حدث خطأ أثناء التنفيذ:\n${error.message}`
      }, { quoted: msg });
    }
  }
};