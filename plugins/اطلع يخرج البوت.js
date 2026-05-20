const { isElite } = require('../haykala/elite'); // تأكدي من المسار
const axios = require('axios');
const fs = require('fs');

module.exports = {
    command: 'اطلع',
    description: 'يخرج البوت نفسه من المجموعة (للنخبة فقط)',
    usage: '.اطلع',
    category: 'group',

    async execute(sock, msg) {
        try {
            const groupJid = msg.key.remoteJid;
            if (!groupJid.endsWith('@g.us')) {
                return await sock.sendMessage(groupJid, {
                    text: ' *الامر ده شغال في المجموعه بس*.'
                }, { quoted: msg });
            }

            const senderJid = msg.key.participant || msg.key.remoteJid;

            if (!isElite(senderJid)) {
                return await sock.sendMessage(groupJid, {
                    text: ' *لما تبقى نخبه ابقى استخدم الامر ده*.'
                }, { quoted: msg });
            }

            const imageUrl = 'https://files.catbox.moe/4g06nf.jpg';
            let buffer;

            try {
                const response = await axios.get(imageUrl, { 
                    responseType: 'arraybuffer', 
                    timeout: 20000 // 20 ثانية مهلة
                });
                buffer = Buffer.from(response.data, 'binary');
            } catch (err) {
                console.error('❌ خطأ في تحميل الصورة:', err.message);
                await sock.sendMessage(groupJid, {
                    text: '❌ حصل خطأ أثناء تحميل الصورة، البوت سيغادر المجموعة بدون صورة.'
                }, { quoted: msg });
            }

            // إرسال الصورة مع النص إذا التحميل نجح
            if (buffer) {
                await sock.sendMessage(groupJid, {
                    image: buffer,
                    caption: '👋🏻 خارج حاضر'
                }, { quoted: msg });
            }

            // مغادرة المجموعة
            await sock.groupLeave(groupJid);

        } catch (err) {
            console.error('❌ خطأ في أمر "اطلع":', err);
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ حصل خطأ:\n\n${err.message || err.toString()}`
            }, { quoted: msg });
        }
    }
};