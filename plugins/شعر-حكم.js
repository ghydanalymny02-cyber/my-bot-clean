const fs = require('fs');
const path = require('path');

module.exports = {
    status: "on",
    name: 'شعر عشوائي',
    command: ['شعر5'],
    category: 'fun',
    description: 'إرسال أبيات شعرية عشوائية',
    hidden: false,
    version: '1.1',

    async execute(sock, msg) {
        try {
            const poems = [
                "إذا المرء لا يرعاك إلا تكلفاً ✦ فدعه ولا تكثر عليه التأسفا",
                "في القلب حزن لا يذهبه ✦ إلا رضاك والحب أبقاه",
                "ألا كل شيء ما خلا الله باطل ✦ وكل نعيم لا محالة زائل",
                "اصبر على مر الجفا من معاشر ✦ فالصبر مفتاح الفرج في الدنيا",
                "وما نيل المطالب بالتمني ✦ ولكن تؤخذ الدنيا غلابا",
                "إذا كنت ذا رأي فكن ذا عزيمة ✦ فإن فساد الرأي أن تترددا",
                "ولا خير في ود امرئ متلون ✦ إذا الريح مالت مال حيث تميل",
                "ومن يجعل المعروف في غير أهله ✦ يكن حمده ذماً عليه ويندم",
                "وما الحب إلا للحبيب الأوحد ✦ وما العيش إلا في ظلال الأمل",
                "إذا أنت أكرمت الكريم ملكته ✦ وإن أنت أكرمت اللئيم تمردا",
                "ومن يتهيب صعود الجبال ✦ يعش أبد الدهر بين الحفر",
                "العلم يرفع بيتاً لا عماد له ✦ والجهل يهدم بيت العز والشرف"
            ];

            const randomPoem = poems[Math.floor(Math.random() * poems.length)];

            // مسار الصورة من مجلد resources أو assets
            const imagePath = path.join(__dirname, '../resources/escanor5.jpg');

            let thumbnail;
            if (fs.existsSync(imagePath)) {
                thumbnail = fs.readFileSync(imagePath);
            } else {
                console.warn('⚠️ لم يتم العثور على الصورة داخل resources/gojo71.jpg');
                thumbnail = null;
            }

            await sock.sendMessage(msg.key.remoteJid, {
                text: `❄ *بيت شعري عشوائي* ❄\n\n${randomPoem}\n\n☀️ *استمتع بهذه الكلمات المعبرة من يوميلا*`,
                contextInfo: {
                    externalAdReply: {
                        title: "🌿 خواطر شعرية",
                        body: "أجمل الأبيات العربية المختارة عشوائيًا",
                        thumbnail,
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: msg });

        } catch (error) {
            console.error('❌ خطأ في أمر الشعر:', error);
            await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ حدث خطأ أثناء جلب الشعر، حاول مرة أخرى لاحقًا.'
            }, { quoted: msg });
        }
    }
};