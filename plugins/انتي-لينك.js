const fs = require('fs');
const path = require('path');
const { jidDecode } = require('@whiskeysockets/baileys');
const { isElite } = require('../haykala/elite.js');

const dataDir = path.join(__dirname, '..', 'data');
const monitorFile = path.join(dataDir, 'monitorState.json');

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(monitorFile)) fs.writeFileSync(monitorFile, JSON.stringify({}));

const loadMonitorState = () => {
  try {
    return JSON.parse(fs.readFileSync(monitorFile));
  } catch (err) {
    console.error("خطأ في قراءة ملف المراقبة:", err);
    return {};
  }
};

const saveMonitorState = (data) => {
  try {
    fs.writeFileSync(monitorFile, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("خطأ في حفظ ملف المراقبة:", err);
  }
};

let handlerAttached = false;

module.exports = {
  command: 'انتي-لينك',
  description: 'تشغيل/إيقاف مراقبة الروابط وطرد من يرسل 3 روابط.',
  category: 'group',
  async execute(sock, m) {
    const groupId = m.key.remoteJid;
    const sender = m.key.participant || m.participant || m.key.remoteJid;
    const senderNumber = (sender || '').split('@')[0];

    if (!groupId.endsWith('@g.us')) {
      return sock.sendMessage(groupId, { text: '❌ هذا الأمر يعمل فقط داخل المجموعات.' }, { quoted: m });
    }

    const metadata = await sock.groupMetadata(groupId);
    const admins = metadata.participants
      .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
      .map(p => p.id.split('@')[0]);

    const isAdmin = admins.includes(senderNumber);

    if (!isElite(senderNumber) && !isAdmin) {
      return sock.sendMessage(groupId, { text: '⚠️ هذا الأمر مخصص فقط للنخبة أو الأدمن.' }, { quoted: m });
    }

    const state = loadMonitorState();

    if (state[`links_${groupId}`]) {
      delete state[`links_${groupId}`];
      saveMonitorState(state);
      return sock.sendMessage(groupId, { text: '❎ تم إيقاف منع الروابط.' }, { quoted: m });
    }

    state[`links_${groupId}`] = { enabled: true, warnings: {} };
    saveMonitorState(state);
    await sock.sendMessage(groupId, { text: '✅ تم تفعيل منع الروابط. سيتم طرد من يرسل 3 روابط.' }, { quoted: m });

    if (handlerAttached) return;
    handlerAttached = true;

    sock.ev.on('messages.upsert', async ({ messages }) => {
      const msg = messages[0];
      const groupId = msg.key.remoteJid;
      if (!groupId.endsWith('@g.us')) return;

      const state = loadMonitorState();
      const groupState = state[`links_${groupId}`];
      if (!groupState || !groupState.enabled) return;

      const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
      const sender = msg.key.participant || msg.participant || msg.key.remoteJid;
      const senderNumber = sender?.split('@')[0];

      if (isElite(senderNumber)) return;

      const containsLink = /(https?:\/\/|wa\.me\/|t\.me\/|discord\.gg|chat\.whatsapp\.com)/i.test(body);

      if (containsLink) {
        if (!groupState.warnings[sender]) groupState.warnings[sender] = 0;
        groupState.warnings[sender] += 1;

        const warnCount = groupState.warnings[sender];
        saveMonitorState(state);

        // حذف الرسالة أولاً
        try {
          await sock.sendMessage(groupId, { delete: msg.key });
        } catch (e) {
          console.error("فشل في حذف الرسالة:", );
        }

        if (warnCount >= 3) {
          await sock.sendMessage(groupId, {
            text: `🚫 تم طرد <@${senderNumber}> بعد 3 تحذيرات بسبب إرسال روابط.`,
            mentions: [sender]
          });
          try {
            await sock.groupParticipantsUpdate(groupId, [sender], 'remove');
          } catch (e) {
            console.error("فشل في الطرد:", e);
          }
        } else {
          await sock.sendMessage(groupId, {
            text: `⚠️ <@${senderNumber}> هذا تحذير رقم ${warnCount} لإرسال روابط.\nسيتم طردك بعد 3 تحذيرات.`,
            mentions: [sender]
          });
        }
      }
    });
  }
};