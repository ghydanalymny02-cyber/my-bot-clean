// *حقوق يوميلا 🛡*
// 📄 ز.js — أمر زلزالي (إفكت + تغيير اسم ووصف)

module.exports = {
  command: ['ز'],
  description: 'إفكت زلزالي ثم تغيير اسم ووصف المجموعة',
  category: 'المجموعة',
  hidden: false,
  version: '1.0',

  async execute(sock, msg, args) {
    try {
      if (!msg.key.remoteJid.endsWith('@g.us')) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: '❌ هذا الأمر يعمل فقط داخل المجموعات'
        }, { quoted: msg });
      }

      const groupJid = msg.key.remoteJid;

      // ✨ إفكت زلزالي قبل التغيير
      await sock.sendMessage(groupJid, {
        text: `❄『 الـزلزال قادم... 』❄\n⏳ استعد للتغيير...`
      }, { quoted: msg });

      await new Promise(resolve => setTimeout(resolve, 2000));

      // اسم ووصف جديد (مزخرف عربي + English)
      const newName = "❄𝒀𝑼𝑴𝑰𝑳𝑨 ❄";
      const newDesc = 
`✦『 الـزلزال قد وقع ✦』
⚡ تم تحديث المجموعة بواسطة أمر ز.js
🐉 القوة بيد ❄𝒀𝑼𝑴𝑰𝑳𝑨

✨ Earthquake Mode ✨
⚡ Group updated by ز.js command
🐉 Power belongs to ❄𝒀𝑼𝑴𝑰𝑳𝑨`;

      // تغيير الاسم
      await sock.groupUpdateSubject(groupJid, newName);

      // تغيير الوصف
      await sock.groupUpdateDescription(groupJid, newDesc);

      // رسالة تأكيد
      await sock.sendMessage(groupJid, {
        text: `✅ تم تغيير اسم ووصف المجموعة:\n\n📛 الاسم الجديد: ${newName}\n📝 الوصف الجديد:\n${newDesc}`
      }, { quoted: msg });

    } catch (error) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ حدث خطأ:\n${error.message}`
      }, { quoted: msg });
    }
  }
};