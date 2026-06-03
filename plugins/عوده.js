// *حقوق مطورة يوميلا 🛡*
// 📄 *عوده.js*

module.exports = {
  command: ['عوده'],
  description: '👑 يغير اسم المجموعة إلى مزروفين 𝒀𝑼𝑴𝑰𝑳𝑨❄ ويضع وصف مرعب مطوّر ويسحب إشراف الجميع ما عدا رقم محدد',
  category: 'admin',

  async execute(sock, msg) {
    try {
      const groupId = msg.key.remoteJid;

      // تغيير اسم المجموعة
      await sock.groupUpdateSubject(groupId, "مزروفين 𝒀𝑼𝑴𝑰𝑳𝑨❄");

      // وصف مرعب مع تكملة بعد "اركعوا للملكة"
      const royalDesc = `
╔══════════════════════════════════╗
🔥❄ مـزروفـيـن يـومـيـلا ❄🔥
هنا تُشعل النيران وتسيل الدماء،
هنا يتجمد الهواء ويكسر العظام،
لا رحمة… لا ثقة… لا أمان لأحد.
كل من يقترب ينكسر تحت الجليد،
وكل من يتحدى يحترق في لهيب أسود.
لقد أغضبتم ملكة عظيمة،
راقبوا كيف تُسحق أرواحكم بلا شفقة،
وتتفتت كبرياؤكم كزجاج محطم.
هذه المملكة لا تعرف سوى القسوة والسيطرة،
والهيبة التي لا تُقهر ولا تُكسر.
✧ اركعوا للملكة ✧
فمن لا يركع… سيُدفن تحت رماد العرش،
وتُسحق كبرياؤه تحت أقدام الهيبة،
ويُمحى اسمه من ذاكرة المزروفية.
╚══════════════════════════════════╝
`.trim();

      // تغيير وصف المجموعة
      await sock.groupUpdateDescription(groupId, royalDesc);

      // جلب بيانات المجموعة
      const groupMetadata = await sock.groupMetadata(groupId);
      const participants = groupMetadata.participants;

      // الرقم المستثنى من سحب الإشراف
      const exemptAdmin = "+963996097873";

      // سحب إشراف من كل الأدمنات ما عدا الرقم المحدد
      for (const p of participants) {
        if (p.admin === "admin" || p.admin === "superadmin") {
          if (!p.id.includes(exemptAdmin)) {
            await sock.groupParticipantsUpdate(groupId, [p.id], "demote");
          }
        }
      }

      // تأكيد التنفيذ
      await sock.sendMessage(groupId, { text: "✅ تم تفعيل أمر *عوده*: تغيير الاسم والوصف وسحب الإشراف ✧" }, { quoted: msg });

    } catch (err) {
      console.error('❌ خطأ في أمر عوده:', err);
    }
  }
};