// 📄 hey-o.js (جزء 1/1)
// *أمر ملحمي يرسل ملف صوتي مع صورة ونص لأوراهارا*

const fs = require('fs');

module.exports = {
  command: ['hey-o'],
  description: 'يرسل ملف صوتي مع صورة من resources لأوراهارا',
  category: 'ميديا',

  async execute(sock, msg) {
    try {
      const jid = msg.key.remoteJid;

      // 🎵 مسار الصوت داخل resources
      const audioPath = '/storage/emulated/0/bot/resources/urahara_theme.mp3';
      // 🖼️ مسار الصورة داخل resources
      const imagePath = '/storage/emulated/0/bot/resources/urahara_shadow.jpg';

      const uraharaText = `
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
   🕸️⚔️ 𝐒𝐇𝐀𝐃𝐎𝐖 𝐋𝐎𝐑𝐃 𝐔𝐑𝐀𝐇𝐀𝐑𝐀 ⚔️🕸️
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

👑 『أنا أوراهارا… سيد الغموض والظل』 👑  
🕸️ حين أتحرك، ترتجف الأسرار احترامًا.  
⚔️ حين أنطق، يصمت الليل رهبةً.  
🔥 أنا لست من يسكن الظل…  
   **الظل يسكنني ويستمد وجوده مني.**

📅 التاريخ: ${new Date().toLocaleDateString('ar-EG')}  
🤖 رقم الظل: ${sock.user.id.split('@')[0]}  
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`.trim();

      if (fs.existsSync(audioPath) && fs.existsSync(imagePath)) {
        await sock.sendMessage(jid, {
          audio: { url: audioPath },
          mimetype: 'audio/mpeg', // ملف صوتي عادي
          caption: uraharaText,
          image: { url: imagePath }
        }, { quoted: msg });
      } else {
        await sock.sendMessage(jid, {
          text: '❌ الملف الصوتي أو الصورة غير موجودة في المسار المحدد.'
        }, { quoted: msg });
      }

    } catch (error) {
      console.error('💥 خطأ في أمر hey-o:', error);
      await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ حصل خلل أثناء إرسال الملف الصوتي والصورة.'
      }, { quoted: msg });
    }
  }
};