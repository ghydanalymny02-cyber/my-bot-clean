const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

/**
 * تحويل أي ملف صوتي إلى ogg بصيغة Voice Note (Opus)
 * @param {string} inputPath
 * @param {string} outputPath
 * @returns {Promise<void>}
 */
function convertToOgg(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(inputPath)) return reject(new Error('❌ الملف الأصلي غير موجود'));

        const cmd = `ffmpeg -y -i "${inputPath}" -c:a libopus -b:a 64k -vbr on "${outputPath}"`;

        exec(cmd, (err, stdout, stderr) => {
            if (err) return reject(err);
            resolve();
        });
    });
}

module.exports = {
    command: 'مشرفين',
    description: 'عرض منشنات المشرفين مع صوت عبد تلقائيًا بعد التحويل إلى ogg',
    category: 'group',
    usage: '.مشرفين',

    async execute(sock, msg, mdata) {
        try {
            const groupJid = msg.key.remoteJid;
            const isGroup = groupJid.endsWith('@g.us');
            const groupMetadata = mdata || await sock.groupMetadata(groupJid);

            // جلب المشرفين فقط
            const admins = groupMetadata.participants.filter(p => p.admin);
            if (!admins || admins.length === 0) {
                return await sock.sendMessage(groupJid, { text: '❌ لا يوجد مشرفين في الجروب.' }, { quoted: msg });
            }

            // المنشنات
            const mentions = isGroup ? admins.map(a => a.id) : [];

            // نص المشرفين
            const adminLines = admins.map(a => `🕷 @${a.id.split('@')[0]}`).join('\n');
            const messageText = 
`🌋 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 ♔ 🌋
عدد المشرفين: ${admins.length}

${adminLines}

⚙️ Dev: wa.me/963996097873`;

            // جلب صورة الجروب
            let groupImg;
            try {
                groupImg = await sock.profilePictureUrl(groupJid, 'image');
            } catch {
                groupImg = 'https://i.imgur.com/ErsJ1VY.jpeg';
            }

            // إرسال الرسالة مع صورة الجروب
            await sock.sendMessage(groupJid, {
                image: { url: groupImg },
                caption: `🐬 *مشرفين المجموعة*\n\n${messageText}`,
                mentions
            }, { quoted: msg });

            // ==========================================
            // إرسال أي صوت موجود في resources كـ voice note
            // ==========================================
            const resourcesDir = path.join(__dirname, '../resources/sks.mp3');
            if (fs.existsSync(resourcesDir)) {
                // البحث عن ملفات صوتية (mp3, m4a, wav)
                const files = fs.readdirSync(resourcesDir).filter(f => f.endsWith('.mp3') || f.endsWith('.m4a') || f.endsWith('.wav') || f.endsWith('.ogg'));
                if (files.length > 0) {
                    let audioPath = path.join(resourcesDir, files[0]);
                    
                    // إذا الملف ليس ogg، نقوم بالتحويل
                    if (!audioPath.endsWith('.ogg')) {
                        const oggPath = audioPath.replace(path.extname(audioPath), '.ogg');
                        await convertToOgg(audioPath, oggPath);
                        audioPath = oggPath;
                    }

                    // إرسال الصوت كـ voice note برتقالي
                    await sock.sendMessage(groupJid, {
                        audio: { url: audioPath },
                        mimetype: 'audio/ogg; codecs=opus',
                        ptt: true,
                        mentions
                    }, { quoted: msg });
                }
            }

        } catch (err) {
            console.error('🚨 خطأ في أمر المشرفين مع الصوت:', err);
            await sock.sendMessage(groupJid, {
                text: '❌ حصل خطأ أثناء استخراج المشرفين أو إرسال الصوت.'
            }, { quoted: msg });
        }
    }
};