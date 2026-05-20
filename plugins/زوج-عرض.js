// حقوق ©️ 𝑭𝑶𝑿
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const dataFile = path.join(dataDir, 'marriages.json');

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, '{}');

const couplesEmojis = ['💑', '👩‍❤️‍👨', '💕', '💞', '💖', '💘', '👩‍❤️‍👩', '👨‍❤️‍👨'];

function loadMarriages() {
  try {
    return JSON.parse(fs.readFileSync(dataFile));
  } catch {
    return {};
  }
}

function getRandomEmoji() {
  return couplesEmojis[Math.floor(Math.random() * couplesEmojis.length)];
}

module.exports = {
  command: ['زوج'],
  description: 'عرض الزيجات المسجلة بشكل منسق وجميل',
  usage: '.زوج عرض',
  category: 'عرس',

  async execute(sock, msg) {
    const args = msg.args || [];
    const chatId = msg.key.remoteJid;

    if (args.length === 0 || args[0].toLowerCase() !== 'عرض') {
      await sock.sendMessage(chatId, {
        text: '⚠️ يرجى كتابة الأمر بشكل صحيح:\n.زوج عرض',
      }, { quoted: msg });
      return;
    }

    const marriages = loadMarriages();
    const entries = Object.entries(marriages);

    if (entries.length === 0) {
      await sock.sendMessage(chatId, {
        text: '❌ لا توجد زيجات مسجلة حالياً.',
      }, { quoted: msg });
      return;
    }

    const displayed = new Set();
    let text = `┏━━━━━━━━━━━━━━━┓\n`;
    text += `💖 *قائمة الزواجات المسجلة* 💖\n`;
    text += `┗━━━━━━━━━━━━━━━┛\n\n`;
    text += `📋 *عدد الزواجات:* ${entries.length}\n\n`;

    for (const [husband, [husbandName, wife]] of entries) {
      if (displayed.has(husband) || displayed.has(wife)) continue;

      const emoji = getRandomEmoji();
      const husbandUser = husband.split('@')[0];
      const wifeUser = wife.split('@')[0];

      text += `${emoji}\n`;
      text += `👰‍♀️ *زوجة:* @${wifeUser}\n`;
      text += `🤵‍♂️ *زوج:* @${husbandUser}\n`;
      text += `───────────────\n`;

      displayed.add(husband);
      displayed.add(wife);
    }

    text += `\n💐 نتمنى للجميع حياة مليئة بالحب والسعادة 💐\n\n`;
    text += `╭───────⎈───────╮\n`;
    text += `✨ 𝘽𝙊𝙏 𝘽𝙔: 『𝑭𝑶𝑿』\n`;
    text += `📛 𝘼𝙇𝙇 𝙍𝙄𝙂𝙃𝙏𝙎 𝙍𝙀𝙎𝙀𝙍𝙑𝙀𝘿 ©️\n`;
    text += `╰───────⎈───────╯`;

    await sock.sendMessage(chatId, {
      text,
      mentions: Array.from(displayed),
    }, { quoted: msg });
  }
};