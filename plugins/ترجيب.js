// 📄 tarhib.js
const path = require("path");

module.exports = {
  command: ["ترحيب"],
  description: "ترحيب أسطوري مع صوت خاص",
  category: "ترحيب",

  async execute(sock, msg) {
    try {
      const jid = msg.key.remoteJid;
      const sender = msg.pushName || "عضو جديد";

      // 🗂️ مسار الصوت داخل resources
      const audioPath = path.join(__dirname, "../resources/welcome_sound.mp3");

      // 👑 رسالة الترحيب المزخرفة
      const welcomeText = `
╔══════════════════════════════════════╗
     👑✨ 𝐓𝐀𝐑𝐇𝐈𝐁 — 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 ✨👑
╚══════════════════════════════════════╝

⚡ أهلاً وسهلاً بك يا @${msg.key.participant?.split("@")[0] || sender}  
🌌 لقد دخلت بين الأساطير…  
🔥 حضورك يضيء المجموعة ويزيدها هيبة!  
`.trim();

      // 🎶 إرسال الصوت الترحيبي (من المسار المحلي)
      await sock.sendMessage(jid, {
        audio: { url: audioPath },
        mimetype: "audio/mp4",
        ptt: true // يرسل كرسالة صوتية (voice note)
      }, { quoted: msg });

      // 📜 إرسال رسالة الترحيب مع المنشن
      await sock.sendMessage(jid, {
        text: welcomeText,
        mentions: [msg.key.participant]
      }, { quoted: msg });

    } catch (err) {
      console.error("💥 خطأ رئيسي في tarhib.js:", err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: "⚠️ حدث خطأ أثناء تنفيذ الترحيب، تأكد من وجود ملف welcome_sound.mp3 داخل مجلد resources."
      }, { quoted: msg });
    }
  }
};