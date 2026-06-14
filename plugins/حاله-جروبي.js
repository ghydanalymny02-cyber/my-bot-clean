const fs = require('fs');
const path = require('path');

// الملفات بتاعت المميزات
const welcomeFile = path.join(__dirname, '..', 'data', 'welcoome.json');
const leaveFile = path.join(__dirname, '..', 'data', 'leave.json');
const adminChangeFile = path.join(__dirname, '..', 'db', 'tanbehat.json');
const linksFile = path.join(__dirname, '..', 'data', 'monitorState.json');

// دالة قراءة آمنة
function loadJSON(file) {
  try {
    if (!fs.existsSync(file)) return {};
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return {};
  }
}

module.exports = {
  command: ['حاله-جروبي'],
  description: 'عرض حالة مميزات الجروب (ترحيب، خروجات، تعديل أدمن، مانع اللينكات).',
  category: 'group',

  async execute(sock, msg) {
    const groupId = msg.key?.remoteJid;
    if (!groupId || !groupId.endsWith('@g.us')) {
      return sock.sendMessage(groupId, { text: '⚠️ هذا الأمر يعمل في الجروبات فقط.' });
    }

    // تحميل قواعد البيانات
    const welcomeDB = loadJSON(welcomeFile);
    const leaveDB = loadJSON(leaveFile);
    const adminChangeDB = loadJSON(adminChangeFile);
    const linksDB = loadJSON(linksFile);

    const welcomeOn = !!welcomeDB[groupId];
    const leaveOn = !!leaveDB[groupId];
    const adminOn = !!adminChangeDB[groupId];
    const linksOn = !!(linksDB[`links_${groupId}`] && linksDB[`links_${groupId}`].enabled);

    // جلب معلومات الجروب
    const metadata = await sock.groupMetadata(groupId);
    const admins = metadata.participants.filter(p => p.admin !== null);
    const adminMentions = admins.map(a => a.id);
    const adminList = admins.map(a => `- @${a.id.split('@')[0]}`).join('\n');

    // تكوين الرسالة
    let statusText = `
📊 *حالة جروب:* ${metadata.subject}

👥 الأعضاء: ${metadata.participants.length}
👑 الأدمنز: ${admins.length}

━━━━━━━━━━━━━━━
🌸 الترحيب: ${welcomeOn ? '✅ شغال' : '❌ مقفول (أمر التفعيل: .الترحيب)'}
🚪 الوداع: ${leaveOn ? '✅ شغال' : '❌ مقفول (أمر التفعيل: .الوداع)'}
🎖️  التنبيهات: ${adminOn ? '✅ شغال' : '❌ مقفول (أمر التفعيل: .التنبيهات)'}
🔗 مانع اللينكات: ${linksOn ? '✅ شغال' : '❌ مقفول (أمر التفعيل: .انتي-لينك)'}
━━━━━━━━━━━━━━━
👑 *قائمة الأدمنز:*
${adminList || 'مفيش أدمنز 😅'}
`.trim();

    await sock.sendMessage(groupId, {
      text: statusText,
      mentions: adminMentions
    });
  }
};