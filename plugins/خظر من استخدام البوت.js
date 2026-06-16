import fs from 'fs';
import path from 'path';
import { extractPureNumber } from '../haykala/elite.js';

export const command = 'حظر';
export const description = 'يمنع مستخدم من استخدام البوت نهائيًا';
export const category = 'إدارة';

const dbPath = path.join(process.cwd(), 'database', 'blockedUsers.json');

// قائمة المطورين المعتمدين (يدعم الأرقام ومعرفات LID)
const DEVELOPERS = ['272344446701714', '106790838616138'];

function loadBlockedUsers() {
  if (!fs.existsSync(dbPath)) return [];
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

function saveBlockedUsers(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export async function execute(sock, m, args) {
  const senderJid = m.key.participant || m.key.remoteJid || '';
  
  // التحقق من أن المرسل هو أحد المطورين المحددين
  const isDeveloper = DEVELOPERS.some(dev => senderJid.includes(dev));

  if (!isDeveloper) {
    return await sock.sendMessage(m.key.remoteJid, {
      text: '🚫 هذا الأمر مخصص للمطورين فقط.'
    }, { quoted: m });
  }

  // استخراج الشخص المستهدف للحظر
  const mentionedJid = m.message?.extendedTextMessage?.contextInfo?.participant || m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  const replyTarget = extractPureNumber(mentionedJid || args[0]);

  if (!replyTarget) {
    return await sock.sendMessage(m.key.remoteJid, {
      text: '❗ رد على رسالة الشخص أو اكتب رقمه بعد الأمر.'
    }, { quoted: m });
  }

  const blocked = loadBlockedUsers();
  if (blocked.includes(replyTarget)) {
    return await sock.sendMessage(m.key.remoteJid, {
      text: `⚠️ الرقم ${replyTarget} محظور بالفعل.`
    }, { quoted: m });
  }

  blocked.push(replyTarget);
  saveBlockedUsers(blocked);

  await sock.sendMessage(m.key.remoteJid, {
    text: `✅ تم حظر المستخدم ${replyTarget} من استخدام البوت.`
  }, { quoted: m });
}
