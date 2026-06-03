// *حقوق مطور يوميلا  🛡*
// 📄 *نهوض.js* (جزء 1/1):

const path = require("path");

module.exports = {
  command: ["نهوض"],
  description: "عرض نهوض يوميلا + فيديو الظلال",
  category: "معلومات",

  async execute(sock, m) {
    try {
      // أول حاجة نعمل تفاعل ♜ على الرسالة
      await sock.sendMessage(m.key.remoteJid, {
        react: {
          text: "♜",
          key: m.key
        }
      });

      // 🗂️ مسار الفيديو داخل resources (مثل نيمار)
      const videoPath = path.join(__dirname, "../resources/shadow_edit.mp4");

      // النصوص المزخرفة عن الظلال
      const captions = [
        `♜ *𝐒𝐇𝐀𝐃𝐎𝐖* ♜ نَهَض...
♜ سيد الظلال خرج من العتمة ليُعلن الهيبة..
♜ ارتجفت الأرض… وسكت الجميع أمام العرش المظلم!`,

        `♜ *𝐒𝐇𝐀𝐃𝐎𝐖* ♜ نَهَض...
♜ الظلال تجمّعت حوله، والهيبة فرضت حضورها..
♜ لا صوت يعلو فوق سلطان الظلام!`,

        `♜ *𝐒𝐇𝐀𝐃𝐎𝐖* ♜ نَهَض...
♜ من أعماق الليل خرج، ليُعيد كتابة الأسطورة..
♜ العرش المظلم لا يرحم، والهيبة لا تُقارن!`
      ];

      // اختيار نص عشوائي
      const caption = captions[Math.floor(Math.random() * captions.length)];

      // إرسال الفيديو + النص
      await sock.sendMessage(m.key.remoteJid, {
        video: { url: videoPath },
        caption: caption
      }, { quoted: m });

    } catch (err) {
      console.error("💥 خطأ رئيسي في نهوض.js:", err);
      await sock.sendMessage(m.key.remoteJid, {
        text: "⚠️ في مشكلة في إرسال الفيديو، اتأكد إن الملف موجود في مجلد resources باسم shadow_edit.mp4"
      }, { quoted: m });
    }
  }
};