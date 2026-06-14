// *حقوق مطورة يوميلا 🛡*
// 📄 *تشجيع.js*

module.exports = {
  command: ['تشجيع'],
  description: '💪 يعطي رسالة دعم وتحفيز لشخص',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      const messages = [
        "💪 أنت قادر على كل شيء، ثق بنفسك!",
        "🔥 قوتك لا تُقهر، استمر!",
        "✨ الهيبة معك دائمًا، لا تتوقف!",
        "🌹 يومك سيكون مليئًا بالنجاح والفخامة!"
      ];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];

      const infoText = `
💪 رسالة تشجيع لـ ${target}:
${randomMessage}

✨ « تشجيع… أمر يضيف طاقة إيجابية داخل القروب. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر تشجيع:', err);
    }
  }
};