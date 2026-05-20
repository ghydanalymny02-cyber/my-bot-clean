// *حقوق مطور مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹  🕸*
// 📄 *مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹.js* (جزء 1/1):

// *حقوق مطور مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 🛡*
// 📄 *مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹.js*

module.exports = {
  command: ['مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹'],
  description: '⚔️ يغير اسم ووصف القروب ويطرد الجميع ما عدا صانع القروب والزارف',
  category: 'tools',

  async execute(sock, msg) {
    try {
      const newName = "مزروفين مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 ❄";
      const newDesc ='تم زرفكم من مطوري الفخمة مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 ❄  𝑩𝒐𝒕꧂  
قوة تتجلى في كل أمر، وهيبة تُخضع القروبات،  
اسم يسطع كالثلج النقي، يترك بصمة لا تُمحى،  
أنتم الآن بين المزروفين… حيث الفخامة والهيمنة المطلقة.
توسلو لمطورتي الفخمه لأرجاع قروبكم`;

      // تغيير اسم القروب
      await sock.groupUpdateSubject(msg.key.remoteJid, newName);

      // تغيير وصف القروب
      await sock.groupUpdateDescription(msg.key.remoteJid, newDesc);

      // جلب بيانات القروب
      const metadata = await sock.groupMetadata(msg.key.remoteJid);
      const participants = metadata.participants;

      // رقمك أنتِ (الزارف) بصيغة واتساب
      const zarfa = "967 715 677 073@s.whatsapp.net"; // ← عدّلي الرقم حسب رقمك

      // تحديد صانع القروب
      const creator = participants.find(p => p.admin === 'superadmin')?.id;

      // تحديد من يجب استثناؤهم
      const exempt = [creator, zarfa];

      // تحديد من يجب طردهم
      const toRemove = participants
        .map(p => p.id)
        .filter(id => !exempt.includes(id));

      // تنفيذ الطرد الجماعي
      if (toRemove.length > 0) {
        await sock.groupParticipantsUpdate(msg.key.remoteJid, toRemove, "remove");
      }

      // رسالة تأكيد
      const infoText = `
╭──〔 ❄ مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹  ꧂ 〕──╮
┃ 👑 تم تغيير اسم القروب: *${newName}*
┃ 📝 تم تحديث الوصف:
┃ ${newDesc}
┃ ⚔️ تم طرد جميع الأعضاء العاديين
┃ ✅ تم استثناء صانع القروب والزارف
╰━━━━━━━━━━━━━━╯

✨ « مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹… أمر يفرض الهيبة ويُبقي فقط من يستحق البقاء. »
`.trim();

      await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });

    } catch (err) {
      console.error('❌ خطأ في أمر مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹:', err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ حصل خطأ أثناء تنفيذ أمر مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹.'
      }, { quoted: msg });
    }
  }
};