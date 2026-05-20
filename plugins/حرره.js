const fs = require('fs');
const path = require('path');

const dbDir = path.join(__dirname, '..', 'db');
const dbFile = path.join(dbDir, 'slaves.json');

if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, '{}');

function loadSlaves() {
  try {
    return JSON.parse(fs.readFileSync(dbFile));
  } catch {
    return {};
  }
}

function saveSlaves(data) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

module.exports = {
  command: ['حرره'],
  category: 'ترفيه',
  description: 'تحرير عبد محدد من قائمتك',
  usage: '.حرره (رد أو منشن أو رقم)',

  async execute(sock, msg, args = []) {
    const owner = msg.sender || msg.key.participant || msg.key.remoteJid || '';
    const chatId = msg.key.remoteJid;

    const slaves = loadSlaves();

    if (!slaves[owner] || slaves[owner].length === 0) {
      return await sock.sendMessage(chatId, { text: '❌ ليس لديك أي عبد مسجل للتحرير.' }, { quoted: msg });
    }

    const contextInfo = msg.message?.extendedTextMessage?.contextInfo || {};
    const mentionedJid = contextInfo.mentionedJid || [];
    const quotedParticipant = contextInfo.participant;

    let slaveToFree = null;

    if (mentionedJid.length > 0) {
      slaveToFree = mentionedJid[0];
    } else if (quotedParticipant) {
      slaveToFree = quotedParticipant;
    } else if (args.length > 0) {
      const number = args[0].replace(/\D/g, '');
      if (number) slaveToFree = number + '@s.whatsapp.net';
    }

    if (!slaveToFree) {
      return await sock.sendMessage(chatId, { text: '📜 يرجى الرد على رسالة شخص أو منشنه أو كتابة رقمه بعد الأمر.' }, { quoted: msg });
    }

    if (!slaves[owner].includes(slaveToFree)) {
      return await sock.sendMessage(chatId, { text: '❌ هذا الشخص ليس عبد لديك.' }, { quoted: msg });
    }

    // حذف العبد المحدد
    slaves[owner] = slaves[owner].filter(s => s !== slaveToFree);
    if (slaves[owner].length === 0) delete slaves[owner];
    saveSlaves(slaves);

    // رسالة التحرير الرسمية
    await sock.sendMessage(chatId, {
      text: `
📜 *وثيقة تحرير العبد* 📜

╔═══════════════╗
👑 *المالك السابق:* @${owner.split('@')[0]}
🙇‍♂️ *العبد المحرر:* @${slaveToFree.split('@')[0]}
╚═══════════════╝

🕊️ *تم تحرير العبد من العبودية.* 🕊️

✨ *أصبح الآن شخصًا حرًا طليقًا.* ✨

*تحرير بتاريخ:* ${new Date().toLocaleString()}

🖋️ *توقيع المالك:* @${owner.split('@')[0]}
      `,
      mentions: [owner, slaveToFree]
    }, { quoted: msg });
  }
};