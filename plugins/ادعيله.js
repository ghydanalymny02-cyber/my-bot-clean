const { eliteNumbers, extractPureNumber } = require('../haykala/elite');
const fs = require('fs');

module.exports = {
  status: "on",
  name: 'ادعيله',
  command: ['ادعيله'],
  category: 'DEVELOPER',
  description: 'مش مهم',
  hidden: false,
  version: '1.0',

  async execute(sock, msg) {
    const senderJid = msg.key.participant || msg.participant || msg.key.remoteJid;
    const senderNumber = extractPureNumber(senderJid);
    const remoteJid = msg.key.remoteJid;
    if (!remoteJid) return;

    const insult = `
صورك🥹في🤓مواقع✨السكس🎀صورك🔥في💥XNXX 😫
يا😍ابن🌚الشرموطه🥶امك🥵متناكه🥺و🤑مربوطه🌝
كسمك🙈يا😹ابن🌷الدعاكه👄كسمك💋زانيه🔞و💥محتاجه🥰
ياض🤪يابنل😏ضاعره🤓امك😚متناكه🥶فاچره❤️‍🔥
كسمك✨يا🤑ابنل😨المتناكه🙊و😫ابوك🔥غفير🔞ابن🥵مرا🎀متناكه😹اقعد🌚يا 🌝معرص😵‍💫في🤠البيت💥
كسمك🌟في🎀المريخ🫦كسمك🥹بيتناك🌝بي😍قشر😬البطيخ😚
كسمك احمر❤️‍🔥في 💫احمر❤️‍🔥كسمك😩عملي😎محضر😹
كسمك😚من🙈اجل😏بلاك🖤بينك🩷امك🔞بتتناك🫦بقزازه🤓استينك🥱
كسمك🥹من😍اجل🥺شاتgpt😉امك👄بتتناك🤪بالسي💿دي🥰
كسمك🥶يا🤠ابن😨الواطيه🥵امك🔥بتتناك🔞عند🤤خالتك 😩الفاضيه🤑
كسمك🫦من🙈اجل🌚اليابان🇯🇵امك🥹بتتناك🤓من😵‍💫باتمان🦇
كسمك🔞في💥كوريا🇰🇷امك❤️‍🔥زانيه😫و🤑منخوليه✨
كسمك🎀في🌝فتنام🇻🇳امك😏بتتشرمط😌في😚المنام🤤
كسمك🥱من😍اجل👄الصين 🇨🇳كسمك🥺بيتناك😉من🥵اليمين🔞
كسمك💫من😬اجل🤤اسبانيا🇪🇸امك🌝بتتناك🫦في🥹الثانيه🤑
🖕🏻كسمك قحبه🖕🏻
🖕🏻كسمك لبوه🖕🏻
🖕🏻كسمك منيوكه🖕🏻
🖕🏻كسمك مربوطه🖕🏻
🖕🏻كسمك خول🖕🏻
🖕🏻كسمك زاني🖕🏻
🖕🏻كسمك علماني🖕🏻
🖕🏻كسمك شرموط🖕🏻
🖕🏻كسمك اسود مخبوط🖕🏻
🖕🏻كسمك ضاعر🖕🏻
🖕🏻كسمك عاهر🖕🏻
🖕🏻كسمك فاجر🖕🏻
🖕🏻كسمك يا ابن العاهر🖕🏻
🖕🏻كسمك عرص🖕🏻
🖕🏻كسمك بيتناك من الجرص🖕🏻`;

    const isElite = eliteNumbers.includes(senderNumber);
    const botJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';

    if (!isElite && senderJid !== botJid) {
      return sock.sendMessage(remoteJid, {
        text: 'انت مش نخبه يا صاحبي 😏'
      }, { quoted: msg });
    }

    const m = msg.message || {};
    let ctx = null;

    if (m.extendedTextMessage?.contextInfo) {
      ctx = m.extendedTextMessage.contextInfo;
    } else if (m.buttonsResponseMessage?.contextInfo) {
      ctx = m.buttonsResponseMessage.contextInfo;
    } else if (m.listResponseMessage?.contextInfo) {
      ctx = m.listResponseMessage.contextInfo;
    }

    const audioPath = '/sdcard/.bot/bot/sounds/AD.mp3';

    // 🟥 ريبلاي على رسالة
    if (ctx?.quotedMessage) {
      const quotedObj = {
        key: {
          remoteJid,
          fromMe: false,
          id: ctx.stanzaId,
          participant: ctx.participant || senderJid
        },
        message: ctx.quotedMessage
      };

      await sock.sendMessage(remoteJid, { text: insult }, { quoted: quotedObj });

      if (fs.existsSync(audioPath)) {
        await sock.sendMessage(remoteJid, {
          audio: fs.readFileSync(audioPath),
          mimetype: 'audio/mp4',
          ptt: true
        }, { quoted: quotedObj });
      }

      return;
    }

    // 🟨 منشن حد
    if (ctx?.mentionedJid?.length > 0) {
      const targetMention = ctx.mentionedJid[0];

      await sock.sendMessage(remoteJid, {
        text: `@${targetMention.split('@')[0]} ${insult}`,
        mentions: [targetMention]
      }, { quoted: msg });

      if (fs.existsSync(audioPath)) {
        await sock.sendMessage(remoteJid, {
          audio: fs.readFileSync(audioPath),
          mimetype: 'audio/mp4',
          ptt: true
        }, { quoted: msg });
      }

      return;
    }

    // ✅ لا منشن ولا ريبلاي
    return sock.sendMessage(remoteJid, {
      text: `@${senderNumber} مين يا مطوري وانا اهين اهله 🐦`,
      mentions: [senderJid]
    }, { quoted: msg });
  }
};