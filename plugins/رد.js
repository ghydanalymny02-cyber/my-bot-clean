// *حقوق مطورة يوميلا  🕸*
// *رقم المطورة: 963996097873*
// *LID: 178817339498583*
// 📄 *رد.js* (جزء 1/1):

// *كود من عمو اسكانور المظ 🫦*
// 📄 *رد.js* (جزء 1/1):

const fs = require('fs');
const { join } = require('path');
const { eliteNumbers } = require('../haykala/elite.js');
const { jidDecode } = require('@whiskeysockets/baileys');

const decode = jid => (jidDecode(jid)?.user || jid.split('@')[0]) + '@s.whatsapp.net';

module.exports = {
    command: 'رد',
    description: 'نظام الردود التلقائية على الكلمات المفتاحية',
    usage: '.رد [اضافة/حذف/بحث/قائمة] [كلمة] => [رد]',
    category: 'admin',

    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const sender = decode(msg.key.participant || jid);
        const senderLid = sender.split('@')[0];

        // التحقق من الصلاحية (المطورة فقط)
        if (!eliteNumbers.includes(senderLid) && senderLid !== '963996097873') {
            return await sock.sendMessage(jid, {
                text: '⛔ هذا الأمر مخصص للمطورة فقط.\n\n🕸️ المطورة: يوميلا 963996097873'
            }, { quoted: msg });
        }

        // مسار ملف الردود
        const repliesPath = join(__dirname, '../data', 'replies.json');

        // إنشاء ملف الردود إذا لم يكن موجوداً
        if (!fs.existsSync(repliesPath)) {
            const defaultReplies = [
                { keyword: "مرحبا", response: "وعليكم السلام 🌸" },
                { keyword: "شكرا", response: "العفو 🤍" },
                { keyword: "بوت", response: "أنا بوت يوميلا 👋" },
                { keyword: "هلو", response: "هلوات 👋" },
                { keyword: "السلام عليكم", response: "وعليكم السلام ورحمة الله وبركاته 🌺" },
                { keyword: "صباح الخير", response: "صباح النور 🌅" },
                { keyword: "مساء الخير", response: "مساء النور 🌆" },
                { keyword: "يوميلا", response: "المطورة الرسمية للبوت 🕸️ 963996097873" },
                { keyword: "المطورة", response: "يوميلا 🕸️ 963996097873" },
                { keyword: "مين مطورك", response: "مطورتي الغالية يوميلا 🕸️ 963996097873" }
            ];
            fs.writeFileSync(repliesPath, JSON.stringify(defaultReplies, null, 2));
        }

        // قراءة الردود الحالية
        let replies = [];
        try {
            replies = JSON.parse(fs.readFileSync(repliesPath, 'utf8'));
        } catch (err) {
            console.error('فشل قراءة الردود:', err.message);
            return await sock.sendMessage(jid, {
                text: 'حدث خطأ أثناء قراءة ملف الردود.'
            }, { quoted: msg });
        }

        // إذا لم يكتب أمر
        if (!args || args.length === 0) {
            let listMessage = `╭━━━━━━━━━━━━━━╮
┃   🤖 *نظام الردود التلقائية*   ┃
╰━━━━━━━━━━━━━━╯

*🕸️ المطورة: يوميلا 963996097873*
*🆔 LID: 178817339498583*

📋 *قائمة الردود:*\n\n`;

            replies.forEach((r, i) => {
                listMessage += `${i+1}. *${r.keyword}* ➔ ${r.response}\n`;
            });

            listMessage += `\n━━━━━━━━━━━━━━

📌 *الأوامر المتاحة:*

➕ *إضافة رد:*
\`.رد اضافة [كلمة] => [رد]\`
مثال: \`.رد اضافة مرحبا => وعليكم السلام\`

➖ *حذف رد:*
\`.رد حذف [كلمة]\`
مثال: \`.رد حذف مرحبا\`

🔍 *بحث:*
\`.رد بحث [كلمة]\`

📋 *عرض القائمة:*
\`.رد قائمة\` أو \`.رد\`

🗑️ *مسح الكل:*
\`.رد مسح\`

𝑬𝑺𝑪𝑨𝑵𝑶𝑹⊰𝑩𝑶𝑻 🌋`;

            return await sock.sendMessage(jid, { text: listMessage }, { quoted: msg });
        }

        const action = args[0].toLowerCase();

        switch (action) {
            case 'اضافة':
            case 'add': {
                if (args.length < 2) {
                    return await sock.sendMessage(jid, {
                        text: '❌ الصيغة: `.رد اضافة كلمة => رد`\n\n🕸️ المطورة: يوميلا 963996097873'
                    }, { quoted: msg });
                }

                const fullText = args.slice(1).join(' ');
                const parts = fullText.split('=>');

                if (parts.length < 2) {
                    return await sock.sendMessage(jid, {
                        text: '❌ استخدم `=>` للفصل بين الكلمة والرد\n\n🕸️ المطورة: يوميلا 963996097873'
                    }, { quoted: msg });
                }

                const keyword = parts[0].trim().toLowerCase();
                const response = parts.slice(1).join('=>').trim();

                // التحقق من عدم التكرار
                const exists = replies.find(r => r.keyword === keyword);
                if (exists) {
                    return await sock.sendMessage(jid, {
                        text: `❌ الرد على كلمة "${keyword}" موجود مسبقاً\n\n🕸️ المطورة: يوميلا 963996097873`
                    }, { quoted: msg });
                }

                replies.push({ keyword, response });
                
                try {
                    fs.writeFileSync(repliesPath, JSON.stringify(replies, null, 2));
                    await sock.sendMessage(jid, {
                        text: `✅ *تم إضافة الرد*\n🔑 *${keyword}* ➔ ${response}\n\n🕸️ المطورة: يوميلا 963996097873`
                    }, { quoted: msg });
                } catch (err) {
                    await sock.sendMessage(jid, {
                        text: 'حدث خطأ أثناء حفظ الرد.'
                    }, { quoted: msg });
                }
                break;
            }

            case 'حذف':
            case 'delete': {
                if (args.length < 2) {
                    return await sock.sendMessage(jid, {
                        text: '❌ الصيغة: `.رد حذف كلمة`\n\n🕸️ المطورة: يوميلا 963996097873'
                    }, { quoted: msg });
                }

                const keywordToDelete = args.slice(1).join(' ').toLowerCase();
                const index = replies.findIndex(r => r.keyword === keywordToDelete);

                if (index === -1) {
                    return await sock.sendMessage(jid, {
                        text: `❌ لا يوجد رد للكلمة "${keywordToDelete}"\n\n🕸️ المطورة: يوميلا 963996097873`
                    }, { quoted: msg });
                }

                replies.splice(index, 1);
                
                try {
                    fs.writeFileSync(repliesPath, JSON.stringify(replies, null, 2));
                    await sock.sendMessage(jid, {
                        text: `✅ *تم حذف الرد* الخاص بكلمة "${keywordToDelete}"\n\n🕸️ المطورة: يوميلا 963996097873`
                    }, { quoted: msg });
                } catch (err) {
                    await sock.sendMessage(jid, {
                        text: 'حدث خطأ أثناء حفظ الردود.'
                    }, { quoted: msg });
                }
                break;
            }

            case 'بحث':
            case 'search': {
                if (args.length < 2) {
                    return await sock.sendMessage(jid, {
                        text: '❌ الصيغة: `.رد بحث كلمة`\n\n🕸️ المطورة: يوميلا 963996097873'
                    }, { quoted: msg });
                }

                const searchTerm = args.slice(1).join(' ').toLowerCase();
                const results = replies.filter(r => 
                    r.keyword.includes(searchTerm) || 
                    r.response.includes(searchTerm)
                );

                if (results.length === 0) {
                    return await sock.sendMessage(jid, {
                        text: `❌ لا توجد نتائج لبحث "${searchTerm}"\n\n🕸️ المطورة: يوميلا 963996097873`
                    }, { quoted: msg });
                }

                let resultMessage = `🔍 *نتائج البحث عن "${searchTerm}":*\n\n`;
                results.forEach((r, i) => {
                    resultMessage += `${i+1}. *${r.keyword}* ➔ ${r.response}\n`;
                });
                resultMessage += `\n🕸️ المطورة: يوميلا 963996097873`;

                await sock.sendMessage(jid, { text: resultMessage }, { quoted: msg });
                break;
            }

            case 'قائمة':
            case 'list': {
                let listMessage = `📋 *قائمة الردود:*\n\n`;
                replies.forEach((r, i) => {
                    listMessage += `${i+1}. *${r.keyword}* ➔ ${r.response}\n`;
                });
                listMessage += `\n📊 *إجمالي الردود:* ${replies.length}\n`;
                listMessage += `\n🕸️ المطورة: يوميلا 963996097873`;

                await sock.sendMessage(jid, { text: listMessage }, { quoted: msg });
                break;
            }

            case 'مسح':
            case 'clear': {
                replies = [];
                try {
                    fs.writeFileSync(repliesPath, JSON.stringify(replies, null, 2));
                    await sock.sendMessage(jid, {
                        text: '🗑️ *تم مسح جميع الردود*\n\n🕸️ المطورة: يوميلا 963996097873'
                    }, { quoted: msg });
                } catch (err) {
                    await sock.sendMessage(jid, {
                        text: 'حدث خطأ أثناء حفظ الردود.'
                    }, { quoted: msg });
                }
                break;
            }

            default:
                await sock.sendMessage(jid, {
                    text: '❌ أمر غير معروف. استخدم `.رد` لعرض المساعدة\n\n🕸️ المطورة: يوميلا 963996097873'
                }, { quoted: msg });
        }
    }
};