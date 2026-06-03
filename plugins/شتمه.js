module.exports = {
  command: 'شتمه',
  description: '😈 شتيمة عشوائية لعضو أو لنفسك 😅',
  category: 'ترفيه',

  async execute(sock, msg) {
    const شتايم = [
      '😂 يا أحلى كائن غير مؤذي ف الكون',
      '😒 شكلك اتفصلت غلط من المصنع',
      '🤡 كفاية وجودك فضيحة كونية',
      '🐸 كنت أقولك حاجة بس افتكرت إنك مش مستاهل',
      '🧽 انت محتاج إعادة تشغيل للدماغ يا معلم'
    ];

    const reply = شتايم[Math.floor(Math.random() * شتايم.length)];

    await sock.sendMessage(msg.key.remoteJid, {
      text: reply
    }, { quoted: msg });
  }
};