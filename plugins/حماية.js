// plugins/protection.js
let protectionEnabled = false;

// قائمة شتائم قوية
const badWords = [
  "قحبة","شرموطة","عرص","منيوك","متناك","لوطي","مخنث",
  "كس امك","كس اختك","كس عرضك","طيزك","زبي","انيك",
  "نيك امك","نيك اختك","يلعن شرفك","يلعن عرضك","ابن القحبة",
  "ابن الشرموطة","ابن الزانية","عاهرة","مومس","داعرة","فاجرة",
  "حمار","وطي","زق","عبيط","قذر","خنزير","معلوق","متسول","كذاب","أهبل","نصاب","غبي",
  "طيز","خرا","ابن الوسخة","قرف","تافه","خايب","عفن","سافل","واطي","غشيم",
  "حشاش","زبالة","معفن","مجنون","أخرق","وضيع","حقير","كلب","ابن حرام","طرطور",
  "بزاف","مخمخ","شرمل","عور","متخلف","Zaml" 
];

let unwatch = null;

module.exports = {
  command: "حماية",
  description: "تفعيل/إلغاء الحماية من الشتائم في القروب.",
  category: "إدارة",

  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;

    if (!chatId.endsWith("@g.us")) {
      return await sock.sendMessage(chatId, {
        text: "🚫 هذا الأمر يعمل داخل المجموعات فقط."
      }, { quoted: msg });
    }

    protectionEnabled = !protectionEnabled;

    const status = protectionEnabled ? "✅ تم تفعيل الحماية" : "❌ تم إيقاف الحماية";
    await sock.sendMessage(chatId, { text: status }, { quoted: msg });

    if (protectionEnabled && !unwatch) {
      unwatch = watchMessages(sock);
    } else if (!protectionEnabled && unwatch) {
      unwatch();
      unwatch = null;
    }
  }
};

// مراقبة الرسائل وحذف أي شتيمة
function watchMessages(sock) {
  const listener = async ({ messages }) => {
    if (!protectionEnabled) return;

    for (const msg of messages) {
      if (!msg.message || !msg.key.remoteJid.endsWith("@g.us")) continue;

      const chatId = msg.key.remoteJid;
      const sender = msg.key.participant || msg.key.remoteJid;

      const body =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        msg.message.imageMessage?.caption ||
        "";

      const lowerBody = body.toLowerCase();

      // تحقق من الشتائم
      if (badWords.some(word => lowerBody.includes(word))) {
        try {
          await sock.sendMessage(chatId, {
            delete: {
              remoteJid: chatId,
              fromMe: false,
              id: msg.key.id,
              participant: sender
            }
          });

          await sock.sendMessage(chatId, {
            text: `⚠️ @${sender.split("@")[0]} كلامك مخالف!`,
            mentions: [sender]
          });
        } catch (err) {
          console.error("❌ خطأ أثناء حذف الرسالة:", err.message);
        }
      }
    }
  };

  sock.ev.on("messages.upsert", listener);
  return () => sock.ev.off("messages.upsert", listener);
}