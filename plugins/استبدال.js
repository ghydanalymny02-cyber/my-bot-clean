// *حقوق مطورة يوميلا 🛡*
// 📄 *استبدال.js*

module.exports = {
  command: ['استبدال'],
  description: '⚙️ يغير اسم ووصف القروب فقط',
  category: 'tools',

  async execute(sock, msg) {
    try {
      // الاسم الجديد للقروب
      const newName = "مزروفين يوميلا ❄";

      // الوصف الجديد للقروب
      const newDesc = `تم استبدال اسم ووصف القروب بواسطة ❄ 𝒀𝑼𝑴𝑰𝑳𝑨 𝑩𝒐𝒕꧂  
✨ لمسة فخمة من يوميلا، حيث القوة والهيبة.`;

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

✨ « استبدال… أمر أنيق يغير هوية القروب بلمسة يوميلا الفخمة. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });

    } catch (err) {
      console.error('❌ خطأ في أمر استبدال:', err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ حصل خطأ أثناء تنفيذ أمر استبدال.'
      }, { quoted: msg });
    }
  }
};