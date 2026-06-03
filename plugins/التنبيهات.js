const fs = require('fs');
const path = require('path');

const dbDir = path.join(__dirname, '..', 'db');
const dbFile = path.join(dbDir, 'الكودالزق.json');

if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, '{}');

function loadAlertsDB() {
  return JSON.parse(fs.readFileSync(dbFile, 'utf8'));
}
function saveAlertsDB(data) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

// نخليها global عشان ما تتكرر
if (globalThis.__alertsListenerRegistered === undefined) {
  globalThis.__alertsListenerRegistered = false;
}

// 🟢 ده اللي بيتسجل مرّة واحدة ويفضل شغال
function registerAlertsListener(sock) {
  globalThis.__alertsListenerRegistered = true;

  // 🎯 متابعة ترقيات وتنزيل الأدمن
  sock.ev.on('group-participants.update', async (update) => {
    try {
      const { id: gid, participants, action, author } = update;
      if (!gid || !participants) return;
      const dbNow = loadAlertsDB();
      if (!dbNow[gid]) return;

      for (const user of participants) {
        const realSender = author || 'مجهول';

        if (action === 'promote') {
          await sock.sendMessage(gid, {
            text: `🕸 @${user.split('@')[0]} تمت ترقيته إلى ادمن بواسطة @${realSender.split('@')[0]}`,
            mentions: [user, realSender]
          });
        } else if (action === 'demote') {
          await sock.sendMessage(gid, {
            text: `🕸 @${user.split('@')[0]} تم تخفيض رتبته من ادمن بواسطة @${realSender.split('@')[0]}`,
            mentions: [user, realSender]
          });
        }
      }
    } catch (err) {
      console.error('Alerts (participants update) error:', err);
    }
  });

  // 🎯 متابعة تحديث إعدادات الجروب
  sock.ev.on('groups.update', async (updates) => {
    try {
      const dbNow = loadAlertsDB();
      for (const update of updates) {
        const gid = update.id;
        if (!dbNow[gid]) continue;

        const changer = update.author || 'مجهول';

        // ✅ الاسم القديم
        if (update.subject !== undefined) {
          const oldName = dbNow[gid]?.lastSubject || 'غير محدد';
          const newName = update.subject;
          await sock.sendMessage(gid, {
            text: `🕸 تم تغيير *اسم الجروب* بواسطة @${changer.split('@')[0]}\n📝 القديم: *${oldName}*\n📝 الجديد: *${newName}*`,
            mentions: [changer]
          });
          dbNow[gid].lastSubject = newName;
          saveAlertsDB(dbNow);
        }

        // ✅ الوصف القديم
        if (update.desc !== undefined) {
          const oldDesc = dbNow[gid]?.lastDesc || 'غير محدد';
          const newDesc = update.desc;
          await sock.sendMessage(gid, {
            text: `🕸 تم تغيير *وصف الجروب* بواسطة @${changer.split('@')[0]}\n📄 القديم:\n${oldDesc}\n📄 الجديد:\n${newDesc}`,
            mentions: [changer]
          });
          dbNow[gid].lastDesc = newDesc;
          saveAlertsDB(dbNow);
        }

        if (update.announce !== undefined) {
          const status = update.announce ? 'مغلق (الأدمنز فقط)' : 'مفتوح (الكل)';
          const action = update.announce ? '🔒 تم قفل الشات' : '🔓 تم فتح الشات';
          await sock.sendMessage(gid, {
            text: `🕸 ${action} بواسطة @${changer.split('@')[0]}\n⚙️ الحالة الجديدة: ${status}`,
            mentions: [changer]
          });
        }

        if (update.restrict !== undefined) {
          const status = update.restrict ? 'الأدمنز فقط' : 'الكل';
          await sock.sendMessage(gid, {
            text: `🕸 تم تغيير إعداد *من يعدل معلومات الجروب* بواسطة @${changer.split('@')[0]}\n⚙️ الحالة الجديدة: ${status}`,
            mentions: [changer]
          });
        }

        if (update.inviteCode) {
          await sock.sendMessage(gid, {
            text: `🕸 تم تغيير الرابط بواسطة @${changer.split('@')[0]}\n🔗 الرابط الجديد: https://chat.whatsapp.com/${update.inviteCode}`,
            mentions: [changer]
          });
        }
      }
    } catch (err) {
      console.error('Alerts (groups update) error:', err);
    }
  });
}

module.exports = {
  command: ['التنبيهات'],
  description: 'تفعيل التنبيهات لتغييرات الأدمن والإعدادات في هذا الجروب.',
  category: 'group',

  async execute(sock, msg) {
    const groupId = msg.key?.remoteJid;
    if (!groupId || !groupId.endsWith('@g.us')) {
      return sock.sendMessage(groupId, { text: '⚠️ هذا الأمر يعمل في الجروبات فقط.' });
    }

    // ✅ تحقق أن اللي مشغل الأمر أدمن
    const metadata = await sock.groupMetadata(groupId);
    const admins = metadata.participants.filter(p => p.admin).map(p => p.id);
    const sender = msg.key.participant || msg.participant || msg.key.remoteJid;
    if (!admins.includes(sender)) {
      return sock.sendMessage(groupId, { text: '⚠️ هذا الأمر مسموح للأدمنز فقط.' });
    }

    const db = loadAlertsDB();
    if (db[groupId]) {
      return sock.sendMessage(groupId, { text: '⚠️ التنبيهات شغّالة بالفعل.\n- لتعطيلها استخدم: .التنبيهات-قفل' });
    }

    // 🟢 أول تفعيل → نخزن الاسم والوصف الحاليين
    const metadataNow = await sock.groupMetadata(groupId);
    db[groupId] = {
      enabled: true,
      lastSubject: metadataNow.subject || 'غير محدد',
      lastDesc: metadataNow.desc || 'غير محدد'
    };
    saveAlertsDB(db);

    await sock.sendMessage(groupId, { text: '✅ تم تفعيل التنبيهات.\n- لتعطيلها استخدم: .التنبيهات-قفل' });

    // 🟢 لو الـ Listener مش مسجل، نسجله دلوقتي
    if (!globalThis.__alertsListenerRegistered) {
      registerAlertsListener(sock);
    }
  },

  registerAlertsListener // 🟢 كده بقت متصدرة
};