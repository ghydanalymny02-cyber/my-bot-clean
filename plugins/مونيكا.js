module.exports = { command: ['مونيكا'], description: '⚙️ يعرض معلومات البوت', category: 'tools',
async execute(sock,msg){ 
 const plugins=getPlugins(); const totalCommands=Object.values(plugins).filter(p=>!p.hidden).length;
 const infoText=`
╭──〔 ❄ 𝒀𝑼𝑴𝑰𝑳𝑨 𝑩𝒐𝒕꧂ 〕──╮
┃ 📦 الأوامر: *${totalCommands}*
┃ 👑 المطور: *يوميلا*
╰━━━━━━━━━━━━━━╯
✨ « مونيكا… أمر يضيف للبوت لمسة من الأناقة والهدوء. »
`.trim();
 await sock.sendMessage(msg.key.remoteJid,{text:infoText},{quoted:msg});
}};