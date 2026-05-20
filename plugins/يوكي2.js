module.exports = { command: ['يوكي2'], description: '⚙️ يعرض معلومات البوت', category: 'tools',
async execute(sock,msg){ 
 const plugins=getPlugins(); const totalCommands=Object.values(plugins).filter(p=>!p.hidden).length;
 const infoText=`
╭──〔 ❄ 𝒀𝑼𝑴𝑰𝑳𝑨 𝑩𝒐𝒕꧂ 〕──╮
┃ 📦 الأوامر: *${totalCommands}*
┃ 👑 المطور: *مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹*
╰━━━━━━━━━━━━━━╯
✨ « يوكي2… أمر يضيف للبوت برودة الثلج ونقاء الروح. »
`.trim();
 await sock.sendMessage(msg.key.remoteJid,{text:infoText},{quoted:msg});
}};