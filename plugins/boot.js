// *حقوق مطور يوميلا 🛡*
// 📄 boot.js

const fs = require('fs');
const { join } = require('path');
const { getPlugins } = require('../handlers/plugins');

module.exports = {
  command: ['boot'],
  description: '⚙️ يعرض معلومات البوت + صورة + مدح مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹',
  category: 'tools',

  async execute(sock, msg) {
    try {
      const zarfPath = join(process.cwd(), 'zarf.json');
      let zarfData = { reaction_status: "on", reaction: "📜" };

      if (fs.existsSync(zarfPath)) {
        zarfData = JSON.parse(fs.readFileSync(zarfPath));
      }

      // تفاعل 📜
      if (zarfData.reaction_status === "on" && zarfData.reaction) {
        await sock.sendMessage(msg.key.remoteJid, {
          react: { text: zarfData.reaction, key: msg.key }
        }).catch(() => {});
      }

      const plugins = getPlugins();
      const totalCommands = Object.values(plugins).filter(p => !p.hidden).length;

      const botJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';

      // 🖼️ مسار الصورة داخل resources
      const imagePath = '/storage/emulated/0/bot/resources/shadow_cardin.jpg';

      // ✨ نص المعلومات + مدح يوميلا
      const infoText = `
╭──〔 ⚙️ 𝗕𝗢𝗧 𝗜𝗡𝗙𝗢 〕──╮
┃ 🔰 الاسم: *❄ مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 𝑩𝒐𝒕꧂*
┃ 📦 الأوامر: *${totalCommands}*
┃ 🛠️ الإصدار: *1.0*
┃ 👑 المطور: 🕸 *مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹*
┃ ⏱️ التشغيل: *${new Date().toLocaleDateString('ar-EG')}*
┃ 🧠 اللغة: *Node.js (Baileys)*
╰━━━━━━━━━━━━━━╯

👑✨ مدح مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 تشان ✨👑
⚔️ سيد العرش المظلم، أسطورة لا تُقارن  
🌌 حضوره يفرض الهيبة والرهبة  
🔥 مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 تشان
 رمز القوة والخلود
`.trim();

      // إرسال الصورة مع الكابشن
      await sock.sendMessage(msg.key.remoteJid, {
        image: { url: imagePath },
        caption: infoText
      }, { quoted: msg });

    } catch (err) {
      console.error('❌ خطأ في أمر boot:', err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ حصل خطأ أثناء عرض معلومات البوت.'
      }, { quoted: msg });
    }
  }
};