// *حقوق مطور مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹🛡*
// 📄 *ولاء.js*

module.exports = {
  command: ['ولاء'],
  description: '💖 يعطي نسبة ولاء لشخص محدد',
  category: 'fun',

  async execute(sock, msg) {
    try {
      // جلب المنشن (إذا موجود)
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const target = mentioned.length > 0 ? mentioned[0] : "شخص مجهول";

      // نسبة عشوائية بين 0 و 100
      const loyalty = Math.floor(Math.random() * 101);

      // النص
      const infoText = `
╭──〔 ❄ مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 𝑩𝒐𝒕꧂ 〕──╮
┃ 💖 نسبة ولاء ${target}
┃ 📊 ${loyalty}%
╰━━━━━━━━━━━━━━╯

✨ « ولاء… أمر يكشف مدى إخلاص الأشخاص بلمسة يوميلا الفخمة. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText, mentions: mentioned }, { quoted: msg });

    } catch (err) {
      console.error('❌ خطأ في أمر ولاء:', err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ حصل خطأ أثناء تنفيذ أمر ولاء.'
      }, { quoted: msg });
    }
  }
};