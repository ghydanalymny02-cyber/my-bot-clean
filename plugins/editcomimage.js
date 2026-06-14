// ─── الموديولات المطلوبة ───────────────────────────────
const fs = require('fs');
const { join } = require('path');
const { isElite } = require('../haykala/elite.js');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');

// ─── المسار الثابت للصورة ─────────────────────────────
const imagePath = join(process.cwd(), 'com.jpeg');

// ─── تعريف الأمر ─────────────────────────────────────
module.exports = {
    command: ['ص'],
    description: 'تحديث صورة واجهة أوامر البوت عبر الرد على صورة',
    category: 'tools',
    usage: '.صوراوامر (بالرد على صورة)',

    async execute(sock, msg) {
// ── الحصول على رقم المرسل والتحقق من النخبة ─────
        const sender = msg.key.participant || msg.key.remoteJid;
        const senderNum = sender.split('@')[0];

        if (!isElite(senderNum)) {
            return sock.sendMessage(msg.key.remoteJid, {
                text: '❌ هذا الأمر مخصص للنخبة فقط.'
            }, { quoted: msg });
        }

// ── استخراج الرسالة المقتبسة (رد على صورة)───
        const reply = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const imageMessage = reply?.imageMessage;

        if (!imageMessage) {
            return sock.sendMessage(msg.key.remoteJid, {
                text: '❌ يرجى الرد على صورة لتحديث صورة الأوامر.'
            }, { quoted: msg });
        }

        try {
// ── تنزيل الصورة ───────────────────────────────
            const buffer = await downloadMediaMessage(
                { message: { imageMessage } },
                'buffer',
                {},
                { reuploadRequest: sock.updateMediaMessage }
            );

// ── حفظ الصورة بنفس الاسم والامتداد ────────────
            fs.writeFileSync(imagePath, buffer);

// ── إرسال رسالة تأكيد ──────────────────────────
            return sock.sendMessage(msg.key.remoteJid, {
                text: '✅ تم تحديث صورة الأوامر بنجاح!',
                mentions: [sender]
            }, { quoted: msg });

        } catch (err) {
            console.error('❌ خطأ في تحديث صورة الأوامر:', err);
            return sock.sendMessage(msg.key.remoteJid, {
                text: '❌ حدث خطأ أثناء محاولة تحديث الصورة.'
            }, { quoted: msg });
        }
    }
};