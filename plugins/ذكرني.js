module.exports = {
  command: ['ذكرني'],
  description: '⏰ يذكرك بعد وقت معين (بالدقائق)',
  category: 'tools',
  async execute(sock, msg) {
    try {
      const body = msg.message?.extendedTextMessage?.text || msg.message?.conversation || '';
      const args = body.trim().split(' ').slice(1);

      const minutes = parseInt(args[0]);
      const reminder = args.slice(1).join(' ') || '🔔 تذكير!';

      if (isNaN(minutes) || minutes <= 0) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: '❌ اكتب عدد الدقائق أولاً.\nمثال: `.ذكرني 10 اشرب ماء`'
        }, { quoted: msg });
      }

      const senderJid = msg.key.participant || msg.key.remoteJid;
      const senderNumber = senderJid.split('@')[0];

      await sock.sendMessage(msg.key.remoteJid, {
        text: `⏱️ سيتم تذكيرك بعد ${minutes} دقيقة.`,
        mentions: [senderJid]
      }, { quoted: msg });

      setTimeout(async () => {
        await sock.sendMessage(msg.key.remoteJid, {
          text: `🔔 تذكير <@${senderNumber}>:\n${reminder}`,
          mentions: [senderJid]
        });
      }, minutes * 60 * 1000);

    } catch (error) {
      console.error('❌ Reminder Error:', error);
      await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ حدث خطأ أثناء ضبط التذكير.'
      }, { quoted: msg });
    }
  }
};