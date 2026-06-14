const fs = require('fs');
const path = require('path');

module.exports = {
  command: 'الكبرياء',
  description: '✨ إرسال رسالة فخمة على ستايل غوجو مع صورة وصوت',
  category: 'خواطر',

  async execute(sock, msg) {
    try {
      const chatId = msg.key.remoteJid;

      // نص غوجو الفخم
      const khatraText = `
🔰⚜ ━━━━『 مـــجـــهـــول مــلــكــ الــكـــبــريــاء 』━━━━ 🔰⚜

🔰 *الكبريا هي صفتي...*  
💀 *أنا مـــجـــهـــول الأعظم، ملك هذا العالم بلا منازع*  
🌪 *خطوة واحدة داخلي... ونهايتك مكتوبة منذ الأزل*  
⚠️ *هنا، لا مكان للضعفاء... إما أن تركع أو تُمحى من الوجود*  
❄ مـــجـــهـــول 𝑩𝒐𝒕꧂
━━━━━━━━━━━━━━━━━━━━
      `;

      // مسارات الملفات
      const audioPath = path.join(__dirname, '../media/escanor1.mp3'); // ملف صوت غوجو
      const imagePath = path.join(__dirname, '../media/escanor.jpg'); // صورة غوجو

      // إرسال النص مع الصورة
      if (fs.existsSync(imagePath)) {
        const imageBuffer = fs.readFileSync(imagePath);
        await sock.sendMessage(chatId, {
          image: imageBuffer,
          caption: khatraText
        }, { quoted: msg });
      } else {
        await sock.sendMessage(chatId, {
          text: '❌ ملف الصورة غير موجود. ضع الملف في مجلد media باسم gojo.jpg'
        }, { quoted: msg });
      }

      // إرسال الصوت بعد الصورة
      if (fs.existsSync(audioPath)) {
        const audioBuffer = fs.readFileSync(audioPath);
        await sock.sendMessage(chatId, {
          audio: audioBuffer,
          mimetype: 'audio/mpeg', // لو mp3
          ptt: false // true لو عايزها فويس نوت
        }, { quoted: msg });
      } else {
        await sock.sendMessage(chatId, {
          text: '❌ ملف الصوت غير موجود. ضع الملف في مجلد media باسم khatra.mp3'
        }, { quoted: msg });
      }

    } catch (err) {
      console.error('❌ خطأ في إرسال الرسالة:', err);
      await sock.sendMessage(msg.key.remoteJid, { text: '❌ حدث خطأ أثناء إرسال الرسالة.' }, { quoted: msg });
    }
  }
};