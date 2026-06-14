const fs = require('fs');
const path = require('path');
const { writeFile, mkdir } = require('fs/promises');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { eliteNumbers } = require('../haykala/elite.js');

// دالة التحقق من النخبة
function isElite(sender) {
    const number = sender.split('@')[0];
    return eliteNumbers.includes(number);
}

module.exports = {
    command: 'لصورة1',

    async execute(sock, m) {
        const sender = m.key.participant || m.participant || m.key.remoteJid;
        const chatId = m.key.remoteJid;

        // التحقق من صلاحية المستخدم
        if (!isElite(sender)) {
            return sock.sendMessage(chatId, {
                text: '🚫 هذا الأمر مخصص للأعضاء النخبة فقط!'
            }, { quoted: m });
        }

        try {
            // استخراج الملصق من الرسالة أو من الرسالة المقتبسة
            const sticker =
                m.message?.stickerMessage ||
                m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage;

            if (!sticker) {
                return sock.sendMessage(chatId, {
                    text: '❌ أرسل هذا الأمر مع ملصق فقط!'
                }, { quoted: m });
            }

            // تحميل محتوى الملصق
            const stream = await downloadContentFromMessage(sticker, 'sticker');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }

            // إنشاء مجلد مؤقت إذا لم يكن موجودًا
            const tempDir = '/sdcard/.bot/bot/temp';
            if (!fs.existsSync(tempDir)) {
                await mkdir(tempDir, { recursive: true });
            }

            // حفظ الصورة مؤقتًا
            const fileName = `sticker_${Date.now()}.jpg`;
            const filePath = path.join(tempDir, fileName);
            await writeFile(filePath, buffer);

            // إرسال الصورة مع الزخرفة والحقوق
            await sock.sendMessage(chatId, {
                image: buffer,
                caption: `
*❐─━──━〘•🌋•〙━──━─❐*
🌋 *تم تحويل الملصق إلى صورة* 
🌋 *حقوق البوت محفوظة* 
*❐─━──━〘•🌋•〙━──━─❐*
مـــجـــهـــول⊰𝑩𝑶𝑻 🌋`.trim()
            }, { quoted: m });

            // حذف الملف المؤقت بعد الإرسال
            fs.unlinkSync(filePath);

        } catch (error) {
            console.error('❌ خطأ أثناء تحويل الملصق إلى صورة:', error);
            await sock.sendMessage(chatId, {
                text: '❌ حدث خطأ أثناء التحويل، حاول مرة أخرى لاحقًا.'
            }, { quoted: m });
        }
    }
};