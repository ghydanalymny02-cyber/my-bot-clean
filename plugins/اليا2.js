module.exports = { command: ['اليا2'], description: '⚙️ يعرض معلومات البوت', category: 'tools',
async execute(sock,msg){ 
 const plugins=getPlugins(); const totalCommands=Object.values(plugins).filter(p=>!p.hidden).length;
 const infoText=`
╭──〔 ❄ 𝒀𝑼𝑴𝑰𝑳𝑨 𝑩𝒐𝒕꧂ 〕──╮
┃ 📦 الأوامر: *${totalCommands}*
┃ 👑 المطور: *يوميلا*
╰━━━━━━━━━━━━━━╯
✨ « اليا2… أمر يضيف للبوت إشراقة النور وبهاء الجمال. »
`.trim();
 await sock.sendMessage(msg.key.remoteJid,{text:infoText},{quoted:msg});
}};