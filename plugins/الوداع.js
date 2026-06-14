const fs = require('fs');
const path = require('path');

const dbDir = path.join(__dirname, '..', 'data');
const dbFile = path.join(dbDir, 'leave.json');

// ✅ تأكد من وجود المجلد والملف
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, '{}');

function loadLeaveDB() {
  return JSON.parse(fs.readFileSync(dbFile, 'utf8'));
}
function saveLeaveDB(data) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

// 🟢 نخليها global عشان ما تتكرر
if (globalThis.__leaveListenerRegistered === undefined) {
  globalThis.__leaveListenerRegistered = false;
}

// 🟢 هنا listener الوداع
function registerLeaveListener(sock) {
  globalThis.__leaveListenerRegistered = true;

  sock.ev.on('group-participants.update', async (update) => {
    try {
      if (!update || update.action !== 'remove' || !update.id) return;

      const dbNow = loadLeaveDB();
      const gid = update.id;
      if (!dbNow[gid]) return;

      // 📌 نجيب بيانات الجروب (عشان العدد)
      const metadata = await sock.groupMetadata(gid);
      const memberCount = metadata.participants.length;

      for (const participant of (update.participants || [])) {
        const username = String(participant).split('@')[0];
        const authorName = update.author ? update.author.split('@')[0] : 'مجهول';

        let ppUrl = null;
        try {
          ppUrl = await sock.profilePictureUrl(participant, 'image');
        } catch {
          try {
            ppUrl = await sock.profilePictureUrl(gid, 'image');
          } catch {}
        }

        // 🟢 الخروج العادي
        if (participant === update.author) {
          const msgText = `
*❛ ━━━━━━･❪ ❁ ❫ ･━━━━━━ ❜*
❒ *╭┈⊰* 💔 الــوداع 💔 *⊰┈ ✦*
*┊˹😔˼┊ وداعاً*
*┊˹👤˼┊ @${username}*
*┊👥 عدد الأعضاء الآن: ${memberCount}*
*┊📤 نتمنى لك التوفيق*

> خرج من الجروب ┊˹🚪˼┊
*❛ ━━━━━━･❪ ❁ ❫ ･━━━━━━ ❜*
♜مـــجـــهـــول 𝑩𝒐𝒕꧂🩸
`.trim();

          const media = ppUrl
            ? { image: { url: ppUrl }, caption: msgText }
            : { text: msgText };

          await sock.sendMessage(gid, { ...media, mentions: [participant] });
        }

        // 🔴 الطرد
        if (participant !== update.author) {
          const msgText = `
*💃 الرقاصة انطردت*
@${username} ❌
👤 بواسطة: @${authorName}
👥 عدد الأعضاء الآن: ${memberCount}
`.trim();

          const media = ppUrl
            ? { image: { url: ppUrl }, caption: msgText }
            : { text: msgText };

          await sock.sendMessage(gid, { ...media, mentions: [participant, update.author] });
        }
      }
    } catch (e) {
      console.error('Leave listener error:', e);
    }
  });
}

module.exports = {
  command: ['الوداع'],
  description: 'تفعيل إشعارات خروج وطرد الأعضاء في هذا الجروب.',
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

    const db = loadLeaveDB();
    if (db[groupId]) {
      return sock.sendMessage(groupId, {
        text: '⚠️ إشعارات الخروج والطرد شغّالة بالفعل.\n- لتعطيلها استخدم: .الوداع-قفل'
      });
    }

    db[groupId] = true;
    saveLeaveDB(db);

    await sock.sendMessage(groupId, {
      text: '✅ تم تفعيل إشعارات الخروج والطرد.\n- لتعطيلها استخدم: .الوداع-قفل'
    });

    if (!globalThis.__leaveListenerRegistered) {
      registerLeaveListener(sock);
    }
  },

  registerLeaveListener // 🟢 عشان لو احتجت تصدّرها للماين
};