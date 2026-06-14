// 📄 ضيفه.js
// أمر .ضيفه <رقم> → يضيف عضو للجروب (للنخبة فقط)

const { isElite } = require('../haykala/elite.js');
const { jidDecode } = require('@whiskeysockets/baileys');

const decode = jid => (jidDecode(jid)?.user || jid.split('@')[0]) + '@s.whatsapp.net';

module.exports = {
    command: 'ضيفه',
    description: 'إضافة عضو جديد للجروب (للنخبة فقط)',
    category: 'DEVELOPER',
    usage: '.ضيفه 20**********',

    async execute(sock, msg) {
        try {
            const sender = decode(msg.key.participant || msg.key.remoteJid);
            const senderLid = sender.split('@')[0];
            const groupId = msg.key.remoteJid;

            // ✨ تحقق من النخبة فقط
            if (!isElite(senderLid)) {
                return await sock.sendMessage(groupId, {
                    text: '❌ هذا الأمر مخصص للنخبة فقط.'
                }, { quoted: msg });
            }

            // 📝 قراءة الرقم من الرسالة
            const body = msg.message?.extendedTextMessage?.text || msg.message?.conversation || '';
            const args = body.trim().split(' ').slice(1);

            if (args.length < 1) {
                return await sock.sendMessage(groupId, {
                    text: '❌ استخدم الأمر بشكل صحيح:\n.ضيفه 201116880068'
                }, { quoted: msg });
            }

            const raw = args[0].replace(/\D/g, '');
            if (raw.length < 8) {
                return await sock.sendMessage(groupId, {
                    text: '❌ الرقم غير صحيح. لازم تبعته بكود الدولة.'
                }, { quoted: msg });
            }

            const numberJid = `${raw}@s.whatsapp.net`;

            // 🔍 فحص إذا كان العضو موجود في الجروب
            const groupMetadata = await sock.groupMetadata(groupId);
            const participants = groupMetadata.participants.map(p => p.id);

            if (participants.includes(numberJid)) {
                return await sock.sendMessage(groupId, {
                    text: `ℹ️ العضو @${raw} موجود بالفعل في *${groupMetadata.subject}*.`,
                    mentions: [numberJid]
                }, { quoted: msg });
            }

            try {
                // 🚀 محاولة إضافة
                const result = await sock.groupParticipantsUpdate(groupId, [numberJid], 'add');
                const response = result[0];

                // ✨ التحقق من النتيجة
                if (response.status === '200') {
                    return await sock.sendMessage(groupId, {
                        text: `✅ تمت إضافة @${raw} إلى *${groupMetadata.subject}* بنجاح!`,
                        mentions: [numberJid]
                    }, { quoted: msg });
                } else {
                    // فشل الإضافة بسبب إعدادات الخصوصية أو أسباب أخرى
                    let inviteCode = null;
                    if (typeof sock.groupInviteCode === 'function') {
                        inviteCode = await sock.groupInviteCode(groupId);
                    }

                    if (inviteCode) {
                        const inviteLink = `https://chat.whatsapp.com/${inviteCode}`;
                        await sock.sendMessage(groupId, {
                            text: `ℹ️ مش قادر أضيف @${raw} مباشرة (لأسباب متعلقة بالخصوصية أو الإعدادات). تم إرسال لينك الدعوة له.`,
                            mentions: [numberJid]
                        }, { quoted: msg });
                        // إرسال اللينك للعضو
                        await sock.sendMessage(numberJid, {
                            text: `🔔 اتفضل انضم لجروب *${groupMetadata.subject}*: ${inviteLink}`
                        });
                    } else {
                        return await sock.sendMessage(groupId, {
                            text: `❌ فشل إضافة @${raw} ولم أتمكن من الحصول على لينك الدعوة.`,
                            mentions: [numberJid]
                        }, { quoted: msg });
                    }
                }

            } catch (errAdd) {
                return await sock.sendMessage(groupId, {
                    text: `❌ فشل الإضافة: ${errAdd.message || 'خطأ غير معروف'}`
                }, { quoted: msg });
            }

        } catch (e) {
            return await sock.sendMessage(groupId, {
                text: `❌ خطأ غير متوقع: ${e.message || e}`
            }, { quoted: msg });
        }
    }
};