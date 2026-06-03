const fs = require('fs');
const path = require('path');
const { isElite } = require('../haykala/elite');

module.exports = {
  command: 'دزني',
  category: 'DEVELOPER',
  description: 'إنشاء جروبات مع إضافة الأرقام مباشرة.',

  async execute(sock, msg, args = []) {
    const sender = msg.key.participant || msg.participant || msg.key.remoteJid;
    if (!isElite(sender)) return;

    // تفاعل 🕸
    try {
      await sock.sendMessage(msg.key.remoteJid, { react: { text: '🕸', key: msg.key } });
    } catch (_) {}

    // ملف الأرقام
    const filePath = path.join(__dirname, '../data/numbers.txt');
    if (!fs.existsSync(filePath)) {
      return await sock.sendMessage(msg.key.remoteJid, { text: '📄 ملف الأرقام مش موجود!' });
    }

    const numbers = fs.readFileSync(filePath, 'utf-8')
      .split('\n')
      .map(num => num.trim())
      .filter(num => num.endsWith('@s.whatsapp.net'));

    if (numbers.length === 0) {
      return await sock.sendMessage(msg.key.remoteJid, { text: '📭 مفيش أرقام صالحة!' });
    }

    const totalGroups = 5; // جرب برقم قليل الأول

    for (let i = 1; i <= totalGroups; i++) {
      try {
        const groupSubject = `Group ${i}`;
        const group = await sock.groupCreate(groupSubject, []); // إنشاء فاضي

        // محاولة إضافة الأعضاء
        try {
          await sock.groupParticipantsUpdate(group.id, numbers, 'add');
          await sock.sendMessage(msg.key.remoteJid, { text: `✅ تم إنشاء الجروب ${i} مع إضافة الأرقام` });
        } catch (errAdd) {
          await sock.sendMessage(msg.key.remoteJid, { text: `⚠️ الجروب ${i} اتعمل لكن فشل إضافة بعض الأرقام:\n${errAdd.message}` });
        }

        await new Promise(res => setTimeout(res, 5000)); // تأخير بين الجروبات

      } catch (err) {
        await sock.sendMessage(msg.key.remoteJid, { text: `❌ فشل إنشاء الجروب ${i}:\n${err.message}` });
        await new Promise(res => setTimeout(res, 5000));
      }
    }

    await sock.sendMessage(msg.key.remoteJid, { text: `🎯 خلصت ${totalGroups} جروبات.` });
  }
};