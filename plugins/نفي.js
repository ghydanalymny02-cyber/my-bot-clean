// *حقوق يوميلا 🛡 🫦*
// 📄 نفي.js

module.exports = {
    command: 'نفي',
    description: 'نفي ملحمي مع إزالة الإشراف إذا موجود',
    usage: '.نفي @user',
    category: 'admin',

    async execute(sock, msg, args) {
        try {
            // استخراج الـ mentions من الرسالة
            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;

            if (!mentioned || mentioned.length === 0) {
                await sock.sendMessage(msg.key.remoteJid, {
                    text: "⚠️ لازم تعمل منشن (@) للعضو المراد نفيه مثل: .نفي @user"
                }, { quoted: msg });
                return;
            }

            const target = mentioned[0]; // أول عضو منشنته

            // جلب معلومات المجموعة
            const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
            const participant = groupMetadata.participants.find(p => p.id === target);

            // إذا العضو أدمن → يشيله من الإشراف
            if (participant?.admin === 'admin' || participant?.admin === 'superadmin') {
                await sock.groupParticipantsUpdate(msg.key.remoteJid, [target], "demote");
            }

            // الرسائل الملحمية
            const text1 = "⚔️ تم نفيك من مملكة ظلال ⚔️";
            const text2 = "🕯️ اسأل نفسك ماذا كنت تفعل...";
            const text3 = "👑 حتى يوميلا بزات قوته نفاك!";
            const text4 = "بص تحت 🥶";

            // إرسال الرسائل واحدة وراء الثانية
            await sock.sendMessage(msg.key.remoteJid, { text: text1, mentions: [target] }, { quoted: msg });
            await sock.sendMessage(msg.key.remoteJid, { text: text2 }, { quoted: msg });
            await sock.sendMessage(msg.key.remoteJid, { text: text3 }, { quoted: msg });
            await sock.sendMessage(msg.key.remoteJid, { text: text4 }, { quoted: msg });

            // تنفيذ الطرد الفعلي
            await sock.groupParticipantsUpdate(msg.key.remoteJid, [target], "remove");

        } catch (error) {
            console.error('❌ خطأ في تنفيذ نفي:', error);
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ حدث خطأ: ${error.message || error.toString()}`
            }, { quoted: msg });
        }
    }
};