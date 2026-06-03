module.exports = {
  command: ['طوبز'],
  category: 'FUN',
  description: 'يكتب طوبز مع شتم شديد للشخص الممنشن أو الرد عليه!',
  usage: '.طوبز @الشخص',

  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;

    // تحديد الشخص الممنشن أو الرد عليه
    let targetJid;
    if (
      msg.message.extendedTextMessage &&
      msg.message.extendedTextMessage.contextInfo &&
      msg.message.extendedTextMessage.contextInfo.mentionedJid &&
      msg.message.extendedTextMessage.contextInfo.mentionedJid.length > 0
    ) {
      targetJid = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
    } else if (
      msg.message.extendedTextMessage &&
      msg.message.extendedTextMessage.contextInfo &&
      msg.message.extendedTextMessage.contextInfo.stanzaId
    ) {
      const quoted = msg.message.extendedTextMessage.contextInfo;
      targetJid = quoted.participant || jid;
    } else {
      targetJid = msg.key.participant || jid;
    }

    const targetMention = `@${targetJid.split('@')[0]}`;

    const insults = [
`${targetMention}

 طوبز اسويلك شغلة تعجبك 🔥👙`,
`${targetMention}

 طوبز افرجيك البعبع🍆`,
`${targetMention}

 طوبز افتحلك فتحة بحياتك ماتقدر تسكرها 🍑🍆`,
`${targetMention}  

 طوبز اسويلك سحر يعجبك 🫦`,
`${targetMention}  

 طوبز عشان ادخلو فيك 🥒 `,
   
    ];

    const randomShout = insults[Math.floor(Math.random() * insults.length)];

    await sock.sendMessage(jid, {
      text: randomShout,
      mentions: [targetJid], // هذه تجعل المنشن يظهر فعليًا في الرسالة
    }, { quoted: msg });
  }
};