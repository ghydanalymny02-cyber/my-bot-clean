// *حقوق مطورة يوميلا 🛡*
const fs = require('fs'); const { join } = require('path'); const { getPlugins } = require('../handlers/plugins');
module.exports = { command: ['كلير2'], description: '⚙️ يعرض معلومات البوت', category: 'tools',
async execute(sock, msg) {
 try {
  const zarfPath = join(process.cwd(), 'zarf.json'); let zarfData = { reaction_status: "on", reaction: "❄️" };
  if (fs.existsSync(zarfPath)) zarfData = JSON.parse(fs.readFileSync(zarfPath));
  if (zarfData.reaction_status === "on") await sock.sendMessage(msg.key.remoteJid,{react:{text:zarfData.reaction,key:msg.key}});
  const plugins = getPlugins(); const totalCommands = Object.values(plugins).filter(p=>!p.hidden).length;
  const infoText = `
╭──〔 ❄ 𝒀𝑼𝑴𝑰𝑳𝑨 𝑩𝒐𝒕꧂ 〕──╮
┃ 📦 الأوامر: *${totalCommands}*
┃ 👑 المطور: *يوميلا*
╰━━━━━━━━━━━━━━╯
✨ « كلير2… أمر يضيف للبوت صفاء وأناقة مضاعفة. »
`.trim();
  await sock.sendMessage(msg.key.remoteJid,{text:infoText},{quoted:msg});
 } catch(err){ await sock.sendMessage(msg.key.remoteJid,{text:'❌ خطأ في أمر كلير2.'},{quoted:msg}); }
}};