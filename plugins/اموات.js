// *حقوق مطورة يوميلا 🛡*
// 📄 *اموات.js*

const fs = require('fs');
const { join } = require('path');

module.exports = {
  command: ['اموات'],
  description: '⚙️ أمر مخفي للمنشن الجماعي',
  category: 'hidden',
  hidden: true, // هذا السطر يجعل الأمر مخفيًا

  async execute(sock, msg) {
    try {
      const zarfPath = join(process.cwd(), 'zarf.json');
      let zarfData = { reaction_status: "on", reaction: "❄️" };

      if (fs.existsSync(zarfPath)) {
        zarfData = JSON.parse(fs.readFileSync(zarfPath));
      }

      if (zarfData.reaction_status === "on" && zarfData.reaction) {
        await sock.sendMessage(msg.key.remoteJid, {
          react: { text: zarfData.reaction, key: msg.key }
        }).catch(() => {});
      }

      // جلب أعضاء المجموعة
      const metadata = await sock.groupMetadata(msg.key.remoteJid);
      const participants = metadata.participants.map(p => p.id);

      const infoText = `
╭──〔 ❄ مـــجـــهـــول 𝑩𝒐𝒕꧂ 〕──╮
┃ 👑 أمر مخفي: *اموات منشن*
┃ 📦 عدد الأعضاء: *${participants.length}*
╰━━━━━━━━━━━━━━╯

✨ « اموات… أمر سري يستدعي الجميع بلمسة غامضة من ❄  𝑩𝒐𝒕꧂.مـــجـــهـــول »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, {
        text: infoText,
        mentions: participants
      }, { quoted: msg });

    } catch (err) {
      console.error('❌ خطأ في أمر اموات:', err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ حصل خطأ أثناء تنفيذ الأمر المخفي اموات.'
      }, { quoted: msg });
    }
  }
};