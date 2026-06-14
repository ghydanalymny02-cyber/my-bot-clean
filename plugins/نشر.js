const fs = require('fs');
const { join } = require('path');
const { eliteNumbers } = require('../haykala/elite.js');
const { jidDecode, downloadMediaMessage } = require('@whiskeysockets/baileys');

const decode = jid => (jidDecode(jid)?.user || jid.split('@')[0]) + '@s.whatsapp.net';

// حقوق 𝑨𝑺𝑯𝑼𝑹𝑨 𝐒𝐇𝐀𝐑𝐄
const ASHURA_RIGHTS = `\n\n▬▭▬▭▬▭▬▭▬▭▬\nᴘᴏᴡᴇʀᴇᴅ ʙʏ : 𝑨𝑺𝑯𝑼𝑹𝑨 𝐒𝐇𝐀𝐑𝐄\n▬▭▬▭▬▭▬▭▬▭▬`;

module.exports = {
    command: 'انشر',
    description: 'نظام الان انشر التفاعلي بالرد على الرسائل',
    usage: '.انشر',
    category: 'الإدارة',
    
    async execute(sock, msg) {
        try {
            const sender = decode(msg.key.participant || msg.key.remoteJid);
            const senderNum = sender.split('@')[0];
            const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';

            // التحقق من الصلاحيات
            if (!eliteNumbers.includes(senderNum)) {
                return await sock.sendMessage(msg.key.remoteJid, {
                    text: `❗ لا تملك صلاحية استخدام هذا الأمر.${ASHURA_RIGHTS}`
                }, { quoted: msg });
            }

            // إذا كان الأمر فقط ".انشر" بدون رد
            if (text === '.انشر' && !quotedMsg) {
                return await sock.sendMessage(msg.key.remoteJid, {
                    text: `📝 *نظام النشر*${ASHURA_RIGHTS}\n\nالرجاء الرد على هذه الرسالة بـ:\n- النص الذي تريد نشره\n- أو الصورة/الفيديو مع التسمية التوضيحية`
                }, { quoted: msg });
            }

            // إذا كان هناك رد على الرسالة
            if (quotedMsg) {
                // تحديد نوع المحتوى
                let content = {};
                
                if (quotedMsg.imageMessage) {
                    const imageBuffer = await downloadMediaMessage(
                        { key: msg.key, message: { ...quotedMsg } },
                        'buffer',
                        {},
                        { reuploadRequest: sock.updateMediaMessage }
                    );
                    content = {
                        type: 'image',
                        data: imageBuffer,
                        caption: (quotedMsg.imageMessage.caption || '') + ASHURA_RIGHTS
                    };
                } 
                else if (quotedMsg.videoMessage) {
                    const videoBuffer = await downloadMediaMessage(
                        { key: msg.key, message: { ...quotedMsg } },
                        'buffer',
                        {},
                        { reuploadRequest: sock.updateMediaMessage }
                    );
                    content = {
                        type: 'video',
                        data: videoBuffer,
                        caption: (quotedMsg.videoMessage.caption || '') + ASHURA_RIGHTS
                    };
                }
                else if (quotedMsg.conversation) {
                    if (quotedMsg.conversation.match(/https?:\/\/[^\s]+/)) {
                        content = {
                            type: 'link',
                            text: quotedMsg.conversation + ASHURA_RIGHTS
                        };
                    } else {
                        content = {
                            type: 'text',
                            text: quotedMsg.conversation + ASHURA_RIGHTS
                        };
                    }
                } else {
                    return await sock.sendMessage(msg.key.remoteJid, {
                        text: `❌ نوع المحتوى غير مدعوم${ASHURA_RIGHTS}\n\nالرجاء إرسال نص، رابط، صورة أو فيديو`
                    }, { quoted: msg });
                }

                // قراءة ملف المجموعات من ../data/nashr
                const nashrPath = join(process.cwd(), '..', 'data', 'nashr');
                if (!fs.existsSync(nashrPath)) {
                    return await sock.sendMessage(msg.key.remoteJid, {
                        text: `❌ ملف النشر غير موجود${ASHURA_RIGHTS}\n\nالرجاء التأكد من وجود الملف في المسار ../data/nashr`
                    }, { quoted: msg });
                }

                // قراءة محتوى الملف
                const groupsContent = fs.readFileSync(nashrPath, 'utf-8');
                const groups = groupsContent.split('\n')
                    .filter(line => line.trim() !== '')
                    .map(line => {
                        const parts = line.split(',');
                        return {
                            jid: parts[0].trim(),
                            name: parts[1] ? parts[1].trim() : 'بدون اسم'
                        };
                    });

                // عملية النشر إلى جميع المجموعات في الملف
                let success = 0, failed = 0;
                const failedGroups = [];

                for (const group of groups) {
                    try {
                        if (content.type === 'text') {
                            await sock.sendMessage(group.jid, { 
                                text: content.text,
                                mentions: [sender]
                            });
                        } 
                        else if (content.type === 'link') {
                            await sock.sendMessage(group.jid, { 
                                text: `📢 *إعلان مهم* 📢\n\n${content.text}\n\n—\nتم النشر بواسطة: @${senderNum}`,
                                mentions: [sender]
                            });
                        }
                        else if (content.type === 'image') {
                            await sock.sendMessage(group.jid, {
                                image: content.data,
                                caption: content.caption,
                                mentions: [sender]
                            });
                        }
                        else if (content.type === 'video') {
                            await sock.sendMessage(group.jid, {
                                video: content.data,
                                caption: content.caption,
                                mentions: [sender]
                            });
                        }

                        success++;
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    } catch (err) {
                        console.error(`فشل الإرسال إلى ${group.jid}:`, err);
                        failed++;
                        failedGroups.push(group.name || group.jid);
                    }
                }

                // إرسال التقرير النهائي
                let report = [
                    `✅ *تقرير النشر النهائي*${ASHURA_RIGHTS}`,
                    `• نوع المحتوى: ${content.type}`,
                    `• عدد المجموعات المستهدفة: ${groups.length}`,
                    `• نجح في: ${success} مجموعة`,
                    failed > 0 ? `• فشل في: ${failed} مجموعة` : '',
                    failedGroups.length > 0 ? `• المجموعات التي فشل الإرسال لها:\n${failedGroups.join('\n')}` : '',
                    `\nتم الانتهاء من عملية النشر 🎉${ASHURA_RIGHTS}`
                ].filter(Boolean).join('\n');

                return await sock.sendMessage(msg.key.remoteJid, { text: report }, { quoted: msg });
            }

        } catch (error) {
            console.error('❌ خطأ في أمر النشر:', error);
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ حدث خطأ أثناء تنفيذ الأمر:${ASHURA_RIGHTS}\n\n${error.message || error.toString()}`
            }, { quoted: msg });
        }
    }
};