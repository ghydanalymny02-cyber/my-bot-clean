module.exports = {
  command: 'زواج',
  description: '💍 يختار شخصين عشوائيين من الجروب ويزوّجهم',
  category: 'fun',

  async execute(sock, msg, args = []) {
    try {
      const groupJid = msg.key.remoteJid;

      if (!groupJid.endsWith('@g.us')) {
        return sock.sendMessage(groupJid, {
          text: '❌ هذا الأمر يعمل فقط داخل الجروبات.'
        }, { quoted: msg });
      }

      const groupMetadata = await sock.groupMetadata(groupJid);
      const participants = groupMetadata.participants;

      if (participants.length < 2) {
        return sock.sendMessage(groupJid, {
          text: '👥 لازم يكون في شخصين على الأقل في الجروب علشان نعمل زواج.'
        }, { quoted: msg });
      }

      // اختار شخصين عشوائيين مختلفين
      let person1, person2;
      do {
        person1 = participants[Math.floor(Math.random() * participants.length)];
        person2 = participants[Math.floor(Math.random() * participants.length)];
      } while (person1.id === person2.id);

      const names = [
        '🥰 مبروك يا عرسان!',
        '💞 تم عقد القِران!',
        '❤️‍🔥 الله يتمم بخير!',
        '👰‍♀️🤵‍♂️ زواج السنة!',
        '🔔 دق الجرس... الف مبروك!'
      ];
      const message = `${names[Math.floor(Math.random() * names.length)]}\n\n👩‍❤️‍👨 تم زواج:\n@${person1.id.split('@')[0]} 💍 @${person2.id.split('@')[0]}`;

      await sock.sendMessage(groupJid, {
        text: message,
        mentions: [person1.id, person2.id]
      }, { quoted: msg });

    } catch (err) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: `❌ حصل خطأ:\n${err.message || err.toString()}`
      }, { quoted: msg });
    }
  }
};