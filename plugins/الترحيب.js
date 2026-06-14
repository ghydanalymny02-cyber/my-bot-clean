const fs = require('fs');
const path = require('path');

const dbDir = path.join(__dirname, '..', 'data');
const dbFile = path.join(dbDir, 'welcoome.json');

// ✅ تأكد من وجود المجلد والملف
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, '{}');

function loadWelcomeDB() {
  return JSON.parse(fs.readFileSync(dbFile, 'utf8'));
}
function saveWelcomeDB(data) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

// 🟢 نخليها global عشان ما تتكرر
if (globalThis.__welcomeListenerRegistered === undefined) {
  globalThis.__welcomeListenerRegistered = false;
}
if (!globalThis.__welcomedOnce) globalThis.__welcomedOnce = new Set();

// 🟢 هنا listener الترحيب
function registerWelcomeListener(sock) {
  globalThis.__welcomeListenerRegistered = true;

  sock.ev.on('group-participants.update', async (update) => {
    try {
      if (!update || update.action !== 'add' || !update.id) return;

      const dbNow = loadWelcomeDB();
      const gid = update.id;
      if (!dbNow[gid]) return;

      // 📌 نجيب بيانات الجروب (عشان العدد)
      const metadata = await sock.groupMetadata(gid);
      const memberCount = metadata.participants.length;

      for (const participant of (update.participants || [])) {
        const key = `${gid}:${participant}`;
        if (globalThis.__welcomedOnce.has(key)) continue;

        const username = String(participant).split('@')[0];
        let ppUrl = null;
        try {
          ppUrl = await sock.profilePictureUrl(participant, 'image');
        } catch {
          try {
            ppUrl = await sock.profilePictureUrl(gid, 'image');
          } catch {}
        }

        const welcomeMessage = `
*❛ ━━━━━━･❪ ❁ ❫ ･━━━━━━ ❜*
❒ *╭┈⊰* 🌷الــتــرحــيــب🌷 *⊰┈ ✦*
*┊˹📯˼┊ اهــلا بـك/ي*
┊˹🥷🏻˼┊ @${username}
┊👥 عدد الأعضاء الآن: *${memberCount}*
┊📩 *اقرأ وصف المجموعة*

> *منور الجروب ┊˹✅˼┊*
*❛ ━━━━━━･❪ ❁ ❫ ･━━━━━━ ❜*
>  مـــجـــهـــولｼ 𝐁𝐎𝐓🩸
`.trim();

        const media = ppUrl
          ? { image: { url: ppUrl }, caption: welcomeMessage }
          : { text: welcomeMessage };

        await sock.sendMessage(gid, { ...media, mentions: [participant] });

        globalThis.__welcomedOnce.add(key);
        setTimeout(() => globalThis.__welcomedOnce.delete(key), 60_000);
      }
    } catch (e) {
      console.error('Welcome listener error:', e);
    }
  });
}

module.exports = {
  command: ['تت'],
  description: 'تفعيل الترحيب بالأعضاء الجدد في هذا الجروب.',
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

    const db = loadWelcomeDB();
    if (db[groupId]) {
      return sock.sendMessage(groupId, {
        text: '⚠️ الترحيب شغّال بالفعل.\n- لتعطيله استخدم: .الترحيب-قفل'
      });
    }

    db[groupId] = true;
    saveWelcomeDB(db);

    await sock.sendMessage(groupId, {
      text: '✅ تم تفعيل الترحيب بالأعضاء الجدد.\n- لتعطيله استخدم: .الترحيب-قفل'
    });

    if (!globalThis.__welcomeListenerRegistered) {
      registerWelcomeListener(sock);
    }
  },

  registerWelcomeListener // 🟢 كده بقت متصدرة زي التنبيهات
};