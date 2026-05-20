module.exports = {
  command: 'عبد',
  description: '🪤 يفضح عبد عشوائي أو اللي اتعمله منشن أو ريبلاي 😂',
  usage: '.عبد',
  category: 'ترفيه',

  async execute(sock, msg) {
    const senderJid = msg.key.participant || msg.key.remoteJid;
    const remoteJid = msg.key.remoteJid;

    const metadata = await sock.groupMetadata(remoteJid);
    const participants = metadata.participants;

    let targetJid;

    // لو في منشن
    const mentionedJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    // لو في ريبلاي
    const quotedParticipant = msg.message?.extendedTextMessage?.contextInfo?.participant;

    if (mentionedJid) {
      targetJid = mentionedJid;
    } else if (quotedParticipant) {
      targetJid = quotedParticipant;
    } else {
      // لو مفيش لا منشن ولا ريبلاي، نختار عشوائي ونستبعد اللي كتب الأمر
      const groupMembers = participants
        .filter((p) => p.id !== senderJid)
        .map((p) => p.id);

      if (groupMembers.length === 0) {
        return sock.sendMessage(remoteJid, {
          text: '😅 مفيش حد تاني في الجروب غيرك يا نجم! خليك أنت العبد المرة دي 😂',
        }, { quoted: msg });
      }

      targetJid = groupMembers[Math.floor(Math.random() * groupMembers.length)];
    }

    const username = '@' + targetJid.split('@')[0];

    const text = `
╭──⊰ 🪤 *عَبـد الـجـروب* ⊱──╮
🐵 هـذا هـو عَـبـد الـجـروب الـزنـجـي الأسـود الـمـغـولـي الـهـنـدي:
🔥 ${username}
╰────────────╯`;

    await sock.sendMessage(remoteJid, {
      text,
      mentions: [targetJid]
    }, { quoted: msg });
  }
};