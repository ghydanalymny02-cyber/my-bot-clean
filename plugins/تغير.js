const fs = require('fs');
const { join } = require('path');
const { eliteNumbers } = require('../haykala/elite.js');

module.exports = {
    command: 'تغير', // اسم الأمر
    description: 'تغيير صورة المجموعة عن طريق الرد على صورة (للنخبة فقط)',
    usage: '.تغير (رد على صورة)',
    category: 'group', // تم تعديل التصنيف إلى group

    async execute(sock, msg) {
        const groupJid = msg.key.remoteJid;
        const sender = msg.key.participant || msg.participant || msg.key.remoteJid;
        const senderLid = sender.split('@')[0];

        // التحقق إذا كان المرسل من النخبة
        if (!eliteNumbers.includes(senderLid)) {
            return await sock.sendMessage(groupJid, { text: '❗ هذا الأمر خاص بالنخبة فقط.' }, { quoted: msg });
        }

        const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quotedMsg || !quotedMsg.imageMessage) {
            return await sock.sendMessage(groupJid, { text: '❗ الرجاء الرد على صورة لتغيير صورة المجموعة.' }, { quoted: msg });
        }

        try {
            const buffer = await sock.downloadMediaMessage({ message: quotedMsg });
            await sock.updateProfilePicture(groupJid, buffer);
            await sock.sendMessage(groupJid, { text: '✅ تم تغيير صورة المجموعة بنجاح.' }, { quoted: msg });
        } catch (err) {
            console.error('❌ حدث خطأ أثناء تغيير صورة المجموعة:', err);
            await sock.sendMessage(groupJid, { text: `❌ حدث خطأ أثناء تغيير صورة المجموعة:\n${err.message || err.toString()}` }, { quoted: msg });
        }
    }
};               return response.data.data || [];
                } catch {
                    return [];
                }
            }

            // البحث في المصدر الأساسي
            let searchResults = await searchAPI(query);

            // إذا لم توجد نتائج، تجربة مصدر بديل (يمكن تغييره حسب الحاجة)
            if (!searchResults || searchResults.length === 0) {
                searchResults = await searchAPI(`تصميم عام ${text}`);
            }

            // فلترة الفيديوهات المرسلة مسبقًا
            let availableResults = searchResults.filter(result => !sentVideos.has(result.nowm));

            if (availableResults.length === 0) {
                return await sock.sendMessage(chatId, { 
                    text: `⚠️ لم نتمكن من العثور على فيديوهات مطابقة للنص: *${text}*.\n\nجرب استخدام كلمات أكثر عمومية مثل "تصميم قرآن" أو "تصميم إسلامي".` 
                }, { quoted: msg });
            }

            // اختيار فيديو عشوائي وإرساله
            let result = availableResults[Math.floor(Math.random() * availableResults.length)];
            sentVideos.add(result.nowm);

            await sock.sendMessage(chatId, {
                video: { url: result.nowm },
                caption: `*🔹 تصميم مطلوب 🔹*\n\n📄 *العنوان*: ${result.title}\n🌐 *الرابط*: ${result.link}`
            }, { quoted: msg });

        } catch (error) {
            await sock.sendMessage(msg.key.remoteJid, { text: `⚠️ حدث خطأ أثناء البحث: ${error.message}` }, { quoted: msg });
            console.error('❌ خطأ في أمر "تصميم":', error);
        }
    }
};