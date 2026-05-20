module.exports = {
  command: 'فجر',
  description: '💣 تفجير شخص بطريقة كوميدية من غوجو عمك',
  category: 'مزاح',

  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;
    const senderName = msg.pushName || 'أنت';
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;

    if (!mentioned || mentioned.length === 0) {
      return sock.sendMessage(chatId, {
        text: '📌 *منشن الشخص اللي عايز غوجو عمك يفجره* 💣\n\nمثال:\n`.فجر @user`'
      }, { quoted: msg });
    }

    const targetJid = mentioned[0];
    const targetName = targetJid.split('@')[0];

    const explosions = [
    `❄ *〘•𝒀𝑼𝑴𝑰𝑳𝑨 𝑩𝑶𝑻•〙* ❄
رما على <@${targetName}> بقنبلة حب ❤️ لدرجة إن الكل اتعجب وبقى الجو رومانسي 😘😂`,
    `❄ *〘•مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 𝑩𝑶𝑻•〙* ❄
رمى قنبلة *قهقهة* على <@${targetName}> وانفجر من الضحك حتى وقع على الأرض 😂🤣`,
    `❄ *〘•مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 𝑩𝑶𝑻•〙* ❄
استدعى نيزك من السماء ونزله على <@${targetName}>، وبدل ما يموت، بقى يرقص شعبي وسط الحارة 💃😂`,
    `❄ *〘•مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 𝑩𝑶𝑻•〙* ❄
حط TNT تحت رجلين <@${targetName}>، وانفجر المكان كله بس هو طلع يقول: *أنا لسه عايش يا معلم!* 😎😂`,
    `❄ *〘•مــجــهــول||𝕲𝕳𝕰𝕯𝕬𝕹 𝑩𝑶𝑻•〙* ❄
أطلق <@${targetName}> في صاروخ للفضاء، دلوقتي بيلف حوالين الأرض ويقول: *إرجعوني يا جدعان* 🌍🤣`
    ];

    const randomExplosion = explosions[Math.floor(Math.random() * explosions.length)];

    await sock.sendMessage(chatId, {
      text: randomExplosion,
      mentions: [targetJid]
    }, { quoted: msg });
  }
};