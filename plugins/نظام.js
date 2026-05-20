const { proto, generateWAMessageFromContent, prepareWAMessageMedia } = require("@whiskeysockets/baileys");

module.exports = {
  name: "نظام",
  command: ["نظام"],
  category: "fun",
  description: "𝑬𝑺𝑪𝑨𝑵𝑶𝑹⊰𝑩𝑶𝑻 🌋  - تجربة سايبربانك تحليلية تفاعلية 🚀",

  async execute(sock, msg, args = []) {
    const jid = msg.key.remoteJid;
    const footer = "𝑬𝑺𝑪𝑨𝑵𝑶𝑹⊰𝑩𝑶𝑻 🌋";

    // الاسم الذي يريد تحليله المستخدم
    const name = args.join(" ").trim() || "المستخدم";

    try {
      // رسالة تمهيدية
      await sock.sendMessage(jid, { text: `☀️ جاري تشغيل 𝑬𝑺𝑪𝑨𝑵𝑶𝑹⊰𝑩𝑶𝑻 🌋 على ${name}...` }, { quoted: msg });
      await sock.sendMessage(jid, { text: "⏳ تحميل وحدة التحليل المستقبلية..." }, { quoted: msg });

      // تعريف الكروت التفاعلية مع صور سايبربانك
      const cardsData = [
        {
          title: "🧬 التحليل المعرفي",
          text: `${name} يمتلك وعي تحليلي متقدّم، يمزج المنطق بالتجريب بدقة غير مألوفة.`,
          image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=900&q=80"
        },
        {
          title: "⚡ السلوك الزمني",
          text: "التفاعلات السلوكية تُظهر اتساقًا عند وجود محفّز ذهني. الانحراف الزمني طفيف ويمكن احتواؤه.",
          image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=900&q=80"
        },
        {
          title: "💡 مسار التطور",
          text: "المسار المثالي: الدمج بين الأنظمة الذكية والهندسة التحليلية. قابلية التكيف: 92%.",
          image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=900&q=80"
        },
        {
          title: "🔮 التوقع الزمني",
          text: "خلال 60 يوماً ستتغيّر الأولويات العقلية باتجاه التفكير النظامي المتعمق.",
          image: "https://images.unsplash.com/photo-1488229297570-58520851e868?auto=format&fit=crop&w=900&q=80"
        }
      ];

      // إنشاء الوسائط التفاعلية لكل كرت
      const cards = [];
      for (const card of cardsData) {
        const media = await prepareWAMessageMedia(
          { image: { url: card.image } },
          { upload: sock.waUploadToServer }
        );

        cards.push({
          header: {
            title: card.title,
            hasMediaAttachment: true,
            imageMessage: media.imageMessage
          },
          body: { text: card.text },
          footer: { text: footer },
          nativeFlowMessage: { buttons: [] }
        });
      }

      // بناء الرسالة النهائية
      const finalMessage = {
        viewOnceMessage: {
          message: {
            interactiveMessage: {
              body: { text: `🚀 نتائج التحليل التفاعلي لـ: *${name}*` },
              footer: { text: footer },
              carouselMessage: { cards }
            }
          }
        }
      };

      const waMsg = generateWAMessageFromContent(jid, finalMessage, { quoted: msg });
      await sock.relayMessage(jid, waMsg.message, { messageId: waMsg.key.id });
      await sock.sendMessage(jid, { react: { text: "✅", key: msg.key } });
    } catch (error) {
      console.error("❌ خطأ في نظام Mohnad_Bot:", error);
      await sock.sendMessage(jid, { react: { text: "❌", key: msg.key } });
      await sock.sendMessage(jid, { text: `⚠️ حصل خطأ أثناء تنفيذ الأمر:\n${error.message}` }, { quoted: msg });
    }
  }
};