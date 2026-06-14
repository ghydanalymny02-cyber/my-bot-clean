import fs from 'fs';
import path from 'path';
import { isElite, extractPureNumber } from '../haykala/elite.js';

export const command = 'فك_الحظر';
export const description = 'يرجع إمكانية استخدام البوت لشخص محظور';
export const category = 'إدارة';

const dbPath = path.join(process.cwd(), 'database', 'blockedUsers.json');

function loadBlockedUsers() {
  if (!fs.existsSync(dbPath)) return [];
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

function saveBlockedUsers(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export async function execute(sock, m, args) {
  const sender = m.key.participant || m.key.remoteJid;
  const pureSender = extractPureNumber(sender);

  if (!isElite(pureSender)) {
    return await sock.sendMessage(m.key.remoteJid, {
      text: '❌ الأمر ده للنخبة فقط.'
    }, { quoted: m });
  }

  const mentionedJid = m.message?.extendedTextMessage?.contextInfo?.participant;
  const replyTarget = extractPureNumber(mentionedJid || args[0]);

  if (!replyTarget) {
    return await sock.sendMessage(m.key.remoteJid, {
      text: '❗ رد على رسالة الشخص أو اكتب رقمه بعد الأمر.'
    }, { quoted: m });
  }

  let blocked = loadBlockedUsers();
  if (!blocked.includes(replyTarget)) {
    return await sock.sendMessage(m.key.remoteJid, {
      text: `⚠️ الرقم ${replyTarget} مش محظور.`
    }, { quoted: m });
  }

  blocked = blocked.filter(n => n !== replyTarget);
  saveBlockedUsers(blocked);

  await sock.sendMessage(m.key.remoteJid, {
    text: `✅ تم فك الحظر عن المستخدم ${replyTarget}.`
  }, { quoted: m });
}