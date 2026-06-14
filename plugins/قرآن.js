// 📄 قرآن_دعاء.js - إرسال فيديو ودعاء منفصل
const fs = require("fs");
const path = require("path");
const { downloadContentFromMessage } = require("@whiskeysockets/baileys");

module.exports = {
    command: "قرآن_دعاء", // تم تعديلها من name إلى command ليتعرف عليها الهاندلر
    aliases: ["قرآن", "دعاء", "quran"],
    description: "📖 إرسال فيديو قرآن مع دعاء منفصل",
    category: "islamic",
    
    // تم تغيير اسم الدالة من run إلى execute لتتوافق مع الهاندلر الأصلي
    async execute(sock, msg) {
        try {
            const groupJid = msg.key.remoteJid;
            let rawSender = msg.key.participant || msg.key.remoteJid || '';
            const senderNumber = rawSender.split('@')[0];

            // الـ LID الماستر الخاص بك للتحقق من المطور
            const mySecretLid = '272344446701714';
            const isDev = rawSender.includes(mySecretLid) || senderNumber === mySecretLid;

            // التأكد أن الأمر داخل مجموعة
            if (!groupJid.endsWith("@g.us")) {
                return sock.sendMessage(groupJid, { 
                    text: "❌ هذا الأمر يعمل فقط داخل المجموعات" 
                }, { quoted: msg });
            }

            const mediaDir = path.join(process.cwd(), "media");
            const videoPath = path.join(mediaDir, "quran_video.mp4");
            
            // إنشاء مجلد media إذا لم يكن موجوداً
            if (!fs.existsSync(mediaDir)) {
                fs.mkdirSync(mediaDir, { recursive: true });
            }

            // التحقق من وجود فيديو مقتبس في الرد (للتحديث - للمطور فقط)
            const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            const hasQuotedVideo = quoted && quoted.videoMessage;

            // إذا كان هناك فيديو مقتبس والمستخدم مطور - يتم تحديث الفيديو
            if (hasQuotedVideo && isDev) {
                await sock.sendMessage(groupJid, { 
                    text: "⏳ جاري تحديث فيديو القرآن..." 
                }, { quoted: msg });

                const stream = await downloadContentFromMessage(quoted.videoMessage, "video");
                let buffer = Buffer.from([]);
                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk]);
                }
                
                fs.writeFileSync(videoPath, buffer);

                return sock.sendMessage(groupJid, { 
                    text: "✅ تم تحديث فيديو القرآن بنجاح!" 
                }, { quoted: msg });
            }

            // التحقق من وجود الفيديو
            const hasVideo = fs.existsSync(videoPath);

            // قائمة الأدعية المتنوعة
            const duas = [
                {
                    title: "🤲 *دعاء الصباح*",
                    text: "اللهم بك أصبحنا وبك أمسينا، وبك نحيا وبك نموت، وإليك النشور.\n\nاللهم إنا نسألك خير هذا اليوم، ونعوذ بك من شر ما فيه."
                },
                {
                    title: "🤲 *دعاء المساء*",
                    text: "اللهم بك أمسينا وبك أصبحنا، وبك نحيا وبك نموت، وإليك المصير.\n\nاللهم إنا نعوذ بك من شر ما خلق."
                },
                {
                    title: "🤲 *دعاء سيد الاستغفار*",
                    text: "اللهم أنت ربي لا إله إلا أنت، خلقتني وأنا عبدك، وأنا على عهدك ووعدك ما استطعت، أعوذ بك من شر ما صنعت، أبوء لك بنعمتك عليَّ، وأبوء بذنبي، فاغفر لي، فإنه لا يغفر الذنوب إلا أنت."
                },
                {
                    title: "🤲 *دعاء الرزق*",
                    text: "اللهم اكفني بحلالك عن حرامك، وأغنني بفضلك عمن سواك.\n\nاللهم ارزقني رزقاً حلالاً طيباً، واجعلني من عبادك الصالحين."
                },
                {
                    title: "🤲 *دعاء الهم والحزن*",
                    text: "اللهم إني عبدك ابن عبدك ابن أمتك، ناصيتي بيدك، ماض فيَّ حكمك، عدل فيَّ قضاؤك، أسألك بكل اسم هو لك سميت به نفسك، أو أنزلته في كتابك، أو علمته أحداً من خلقك، أو استأثرت به في علم الغيب عندك، أن تجعل القرآن العظيم ربيع قلبي، ونور صدري، وجلاء حزني، وذهاب همي."
                },
                {
                    title: "🤲 *دعاء النوم*",
                    text: "باسمك اللهم أموت وأحيا.\n\nاللهم قني عذابك يوم تبعث عبادك.\n\nاللهم إني أسلمت نفسي إليك، ووجهت وجهي إليك، وفوضت أمري إليك، رغبة ورهبة إليك، لا ملجأ ولا منجا منك إلا إليك."
                }
            ];

            // اختيار دعاء عشوائي
            const randomDua = duas[Math.floor(Math.random() * duas.length)];

            // جلب أعضاء المجموعة للمنشن
            const groupMetadata = await sock.groupMetadata(groupJid);
            const participants = groupMetadata.participants.map(p => p.id);

            const invisibleChar = "\u200B";

            // إنشاء اقتباس وهمي للفيديو
            const fakeQuote = {
                key: {
                    fromMe: false,
                    participant: "0@s.whatsapp.net",
                    remoteJid: groupJid,
                },
                message: {
                    videoMessage: {
                        title: "📖 القرآن",
                        seconds: "99999",
                        gifPlayback: true,
                        caption: "آيات قرآنية",
                        jpegThumbnail: Buffer.alloc(0),
                    },
                },
            };

            // 1️⃣ إرسال الفيديو أولاً إذا كان موجوداً
            if (hasVideo) {
                const videoBuffer = fs.readFileSync(videoPath);
                
                await sock.sendMessage(
                    groupJid,
                    {
                        video: videoBuffer,
                        fileName: "quran_video.mp4",
                        mimetype: "video/mp4",
                        ptv: true,
                        caption: `${invisibleChar}📖 *آيات من القرآن الكريم*\n\nتم إرسال هذا الفيديو للجميع`,
                        mentions: participants
                    },
                    { quoted: fakeQuote }
                );

                // تأخير بسيط بين الفيديو والدعاء
                await new Promise(resolve => setTimeout(resolve, 1500));
            }

            // 2️⃣ إرسال الدعاء بشكل منفصل
            const duaMessage = 
                `${invisibleChar}╭━━━━━━━━━━━━━━━━━━╮\n` +
                `┃   🤲 *الدعاء* 🤲   ┃\n` +
                `╰━━━━━━━━━━━━━━━━━━╯\n\n` +
                
                `${randomDua.title}\n\n` +
                `${randomDua.text}\n\n` +
                
                `━━━━━━━━━━━━━━━━━━\n` +
                `📖 *اللهم تقبل منا ومنكم* 📖\n` +
                `⚡ *𝒀𝑼𝑴𝑰𝑳𝑨 𝐁𝐎𝐓* ⚡`;

            if (hasVideo) {
                await sock.sendMessage(groupJid, { text: duaMessage, mentions: participants }, { quoted: msg });
            } else {
                await sock.sendMessage(groupJid, { text: `${invisibleChar}⚠️ لا يوجد فيديو قرآن محفوظ في السيرفر حالياً.\n\n${duaMessage}`, mentions: participants }, { quoted: msg });
            }

            // إضافة تفاعل بالإيموجي
            await sock.sendMessage(groupJid, {
                react: { text: "📖", key: msg.key }
            });

        } catch (err) {
            console.log("خطأ في أمر قرآن_دعاء:", err);
            await sock.sendMessage(msg.key.remoteJid, { 
                text: `❌ حدث خطأ:\n${err.message || err.toString()}` 
            }, { quoted: msg });
        }
    },
};
