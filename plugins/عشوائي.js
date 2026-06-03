module.exports = {
  command: 'عشوائي',
  description: '😚 منشن شخص عشوائي من الجروب وقوله كلام رومانسي',
  category: 'fun',

  async execute(sock, msg, args = []) {
    try {
      const groupJid = msg.key.remoteJid;

      if (!groupJid.endsWith('@g.us')) {
        return sock.sendMessage(groupJid, {
          text: '❌ هذا الأمر يعمل فقط داخل القروبات.'
        });
      }

      const groupMetadata = await sock.groupMetadata(groupJid);
      const participants = groupMetadata.participants;

      const senderId = msg.key.participant || msg.participant || msg.key.remoteJid;

      // استبعاد البوت وصاحب الرسالة
      const filtered = participants.filter(p => {
        const id = p.id || p.jid;
        return id && id !== senderId && !id.includes(sock.user.id);
      });

      if (filtered.length === 0) {
        return sock.sendMessage(groupJid, {
          text: '😕 مفيش حد أقدر أختاره غيرك...'
        });
      }

      const random = filtered[Math.floor(Math.random() * filtered.length)];
      const randomPerson = random.id || random.jid;
      const randomTag = `@${randomPerson.split('@')[0]}`;

      const flirtyLines = [
        `أنا معرفش إزاي بس وجودك بيخليني أبتسم كل مرة 💖`,
        `مفيش يوم بيعدي من غير ما أفكر فيك 😍`,
        `إنت أول حاجة بتيجي في بالي وآخر حاجة بنساها 🥺`,
        `نفسي أقضي يوم كامل بس معاك، نتكلم ونضحك وننسى العالم 🌍💫`,
        `كل مرة بشوفك فيها، بحس إن قلبي بيرقص 💃❤️`,
        `إنت السبب إني بقيت أحب الصدف، عشان قابلتك بيها ✨`,
        `كل كلمة منك بتغير يومي، بجد ✉️💌`,
        `ضحكتك؟ علاج لقلبي 💊💘`,
        `كنت بدوّر على حاجة تخليني مبسوط... طلعت إنت 😊`,
        `إنت مش بس حلو، إنت حلم بمشي على الأرض 😍👣`,
        `لو الجمال له اسم... يبقى أكيد اسمك 💎`,
        `صوتك بيرن في ودني حتى وانت ساكت 🎶❤️`,
        `لو كنت كلمة، كنت 'الحب' نفسها 💖📖`,
        `إنت مش عادي... إنت استثناء جميل في حياتي 🌟`,
        `أنا بحبك من غير سبب، وده أجمل سبب 💞`,
        `كل لحظة بشوفك فيها، بحس إنها أحلى من اللي قبلها 🌸`,
        `عيونك فيها حاجة بتسحرني كل مرة 😵‍💫`,
        `أنا مش بس بحبك... أنا معجب بإني عرفتك 💝`,
        `إنت جرعة لطافة فوق الطبيعي ☁️🧸`,
        `إنت الشخص اللي وجوده بيخلي الدنيا ألطف ✨`,
        `أنا عايز وقتي كله يبقى حوالين ضحكتك 🕰️💕`,
        `كل مرة تكلمني فيها، بحس إن الدنيا بخير 🌈`,
        `إنت الحتة الحلوة اللي في يومي 🍫`,
        `أنا مش فاهم إزاي قلبي اختارك... بس واضح إنه ذكي جدًا 😄❤️`,
        `وجودك بالنسبالي مش صدفة... ده قدر جميل 🫶`,
        `إنت بتضحك ليه؟ ولا عارف إني واقع فيك 😳😂`,
        `يا بخت اللي هيصحى على صوتك كل يوم ☀️💘`,
        `إنت مش بس مميز... إنت المعنى الحقيقي للكلمة ✨`,
        `أنا اتأكدت إن الحب لسه موجود... لما شفتك ❤️`,
        `لو كنت رسمة، كنت لوحة فنية متتعادش 🎨🖼️`
      ];

      const message = `${randomTag} ${flirtyLines[Math.floor(Math.random() * flirtyLines.length)]}`;

      await sock.sendMessage(groupJid, {
        text: message,
        mentions: [randomPerson]
      });

    } catch (err) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: `❌ حصل خطأ:\n${err.message || err.toString()}`
      });
    }
  }
};