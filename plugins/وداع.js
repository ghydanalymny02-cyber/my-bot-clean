const fs = require('fs');
const path = require('path');

// اسم ملف قاعدة البيانات
const dbDir = path.join(__dirname, '..', 'data');
const dbFile = path.join(dbDir, 'farewell.json');

// تأكد من وجود المجلد والملف
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, '{}');

function loadFarewellDB() {
  return JSON.parse(fs.readFileSync(dbFile, 'utf8'));
}

function saveFarewellDB(data) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

// مخزن لمنع تكرار رسالة الوداع لنفس الشخص خلال دقيقة
if (!globalThis.__farewelledOnce) globalThis.__farewelledOnce = new Set();
// نتأكد إننا مش بنسجل Listener أكتر من مرة
if (globalThis.__farewellListenerRegistered === undefined) globalThis.__farewellListenerRegistered = false;

module.exports = {
  command: ['وداع'],
  description: 'تفعيل الوداع عند مغادرة الأعضاء للمجموعة.',
  category: 'group',
  async execute(sock, msg) {
    const groupId = msg.key?.remoteJid;
    if (!groupId || !groupId.endsWith('@g.us')) {
      return sock.sendMessage(groupId, { text: 'هذا الأمر يعمل في الجروبات فقط.' });
    }

    const db = loadFarewellDB();
    const isActive = !!db[groupId];

    if (isActive) {
      return sock.sendMessage(groupId, {
        text: '⚠️ الوداع شغّال بالفعل.\n- لتعطيله استخدم: .وداع-قفل'
      });
    }

    // فعّل الوداع للجروب واحفظ
    db[groupId] = true;
    saveFarewellDB(db);

    await sock.sendMessage(groupId, {
      text: '✅ تم تفعيل الوداع عند مغادرة الأعضاء.\n- لتعطيله استخدم: .وداع-قفل'
    });

    // سجل الـ Listener مرة واحدة فقط على مستوى البوت كله
    if (!globalThis.__farewellListenerRegistered) {
      globalThis.__farewellListenerRegistered = true;

      sock.ev.on('group-participants.update', async (update) => {
        try {
          if (!update || update.action !== 'remove' || !update.id) return;

          const dbNow = loadFarewellDB();
          // لو الوداع مقفول للجروب دا — اخرج
          if (!dbNow[update.id]) return;

          const gid = update.id;
          for (const participant of (update.participants || [])) {
            const key = `${gid}:${participant}`;
            if (globalThis.__farewelledOnce.has(key)) continue; // منع التكرار المؤقت

            const username = String(participant).split('@')[0];
            let ppUrl = null;
            try {
              ppUrl = await sock.profilePictureUrl(participant, 'image');
            } catch (error) {
              console.log('No profile picture for participant, trying group icon.');
              try {
                ppUrl = await sock.profilePictureUrl(gid, 'image');
              } catch (e) {
                console.log('No group icon either.');
              }
            }

            const farewellMessage = `
*❛ ━━━━━━･❪ ❁ ❫ ･━━━━━━ ❜*
❒ *╭┈⊰* 💔 الـــوداع 💔 *⊰┈ ✦*
*┊˹😔˼┊ وداعاً*
┊˹👤˼┊ @${username}
┊📤 *نتمنى لك التوفيق*

> *خرج من الجروب ┊˹🚪˼┊*
*❛ ━━━━━━･❪ ❁ ❫ ･━━━━━━ ❜*
>  𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝐁𝐎𝐓🩸
`.trim();

            const media = ppUrl
              ? { image: { url: ppUrl }, caption: farewellMessage }
              : { text: farewellMessage };

            await sock.sendMessage(gid, { ...media, mentions: [participant] });

            // امنع تكرار الوداع لنفس العضو لمدة دقيقة
            globalThis.__farewelledOnce.add(key);
            setTimeout(() => globalThis.__farewelledOnce.delete(key), 60_000);
          }
        } catch (e) {
          console.error('Farewell listener error:', e);
        }
      });
    }
  }
};
