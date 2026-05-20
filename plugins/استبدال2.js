// *حقوق مطورة يوميلا 🛡*
// 📄 *استبدال2.js*

module.exports = {
  command: ['استبدال2'],
  description: '⚙️ يغير اسم ووصف القروب فقط (نسخة ثانية)',
  category: 'tools',

  async execute(sock, msg) {
    try {
      // الاسم الجديد للقروب
      const newName = "مزوفين ❄ 𝒀𝑼𝑴𝑰𝑳𝑨";

      // الوصف الجديد للقروب
      const newDesc = `تم زرفكم من مطورتي الفخمة يوميلا ❄ 𝒀𝑼𝑴𝑰𝑳𝑨 𝑩𝒐𝒕꧂  
قوة تتجلى في كل أمر، وهيبة تُخضع القروبات،  
اسم يسطع كالثلج النقي، يترك بصمة لا تُمحى،  
أنتم الآن بين المزروفين… حيث الفخامة والهيمنة المطلقة.`;

      // تغيير اسم القروب
      await sock.groupUpdateSubject(msg.key.remoteJid, newName);

      // تغيير وصف القروب
      await sock.groupUpdateDescription(msg.key.remoteJid, newDesc);

      // رسالة تأكيد
      const infoText = `
╭──〔 ❄ 𝒀𝑼𝑴𝑰𝑳𝑨 𝑩𝒐𝒕꧂ 〕──╮
┃ 👑 تم تغيير اسم القروب: *${newName}*
┃ 📝 تم تحديث الوصف:
┃ ${newDesc}
╰━━━━━━━━━━━━━━╯

✨ « استبدال2… أمر أنيق يغير هوية القروب بلمسة يوميلا الفخمة. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });

    } catch (err) {
      console.error('❌ خطأ في أمر استبدال2:', err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ حصل خطأ أثناء تنفيذ أمر استبدال2.'
      }, { quoted: msg });
    }
  }
};