const fs = require('fs');
const path = require('path');

const WARNINGS_FILE = path.join(__dirname, '../data/warnings.json');

// تحميل بيانات الإنذارات
function loadWarnings() {
  if (!fs.existsSync(WARNINGS_FILE)) {
    fs.writeFileSync(WARNINGS_FILE, JSON.stringify({}));
  }
  return JSON.parse(fs.readFileSync(WARNINGS_FILE));
}

module.exports = {
  command: 'الانذارات',
  category: 'group',
  description: 'عرض عدد التحذيرات والأسباب لكل عضو في المجموعة.',
  group: true,

  async execute(sock, msg) {
    const chatId = msg.key.remoteJid;

    const warnings = loadWarnings();
    if (!warnings[chatId]) {
      return await sock.sendMessage(chatId, {
        text: '📋 لا يوجد أي إنذارات في هذه المجموعة.',
      }, { quoted: msg });
    }

    const groupWarnings = warnings[chatId];
    const groupMetadata = await sock.groupMetadata(chatId);
    const participants = groupMetadata.participants;

    let reply = '📋 *قائمة الإنذارات الحالية:*\n\n';
    let mentions = [];
    let hasWarnings = false;

    for (const member of participants) {
      const id = member.id;
      const data = groupWarnings[id];

      // البيانات القديمة (عدد فقط) أو الجديدة (كائن يحتوي على عدد وأسباب)
      let count = 0;
      let reasons = [];

      if (typeof data === 'number') {
        count = data;
      } else if (data && typeof data === 'object') {
        count = data.count || 0;
        reasons = data.reasons || [];
      }

      if (count > 0) {
        hasWarnings = true;
        reply += `🔸 @${id.split('@')[0]} — ${count} إنذار${count > 1 ? 'ات' : ''}\n`;

        // عرض كل الأسباب لو موجودة
        if (reasons.length > 0) {
          reasons.forEach((reason, i) => {
            reply += `   • السبب ${i + 1}: ${reason}\n`;
          });
        }

        reply += '\n';
        mentions.push(id);
      }
    }

    if (!hasWarnings) {
      reply += 'لا يوجد أي أعضاء عندهم إنذارات 👌';
    }

    await sock.sendMessage(chatId, {
      text: reply.trim(),
      mentions
    }, { quoted: msg });
  }
};