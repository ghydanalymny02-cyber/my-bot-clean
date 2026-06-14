const fs = require("fs");
const path = require("path");

module.exports = {
  command: "دزو",
  description: "رد ساخر على كلمة دز",
  usage: ".دز",
  category: "ترفيه",

  async execute(sock, msg) {
    try {
      const replies = [
        "متدز انت يـ عم! ولا عشان أنا عمّك؟ 😒",
        "َدز دز وخلاص؟ متدز بعيد عننا كده 💨",
        "هَش انت يـ عم، اتكلم مصري وقول هش🗿",
        "َدز على راسك! فاكر نفسك فوق القانون؟ 🤨",
        "دَز؟ دز على باب بيتكو بالمرة 🧹",
        "شكلك فاضي يا عم، روح بقى نام  😴",
        "َدز إيه؟ دز نفسك و نام بدري لأن العيال الصغيره تنام بدري🐦‍⬛🤙",
        "دَز؟ دز انت ي عم و العب بعيد عن عمك 😉",
        "دز؟ هو احنا في سباق جمال ولا إيه؟ 🐸",
        "اكتب جملة مفيدة قبل ما تدز، احترم اللغة يا فندم 📚",
        "دزت على إيه طيب؟ مافيش حاجة أصلاً 😐",
        "دز؟ دانت محتاج تنضرب بالشبشب مش تترد عليك 🩴",
        "ليه دز؟ ناقصك حب واهتمام؟ 💔",
        "دز وبتقلب! فكرني بمسلسلات رمضان 😂",
        "ده انت لو قلت هش كنت أرحم 🙃",
        "ممنوع الدز بدون رخصة من الملك 👑",
        "كم مرة قلتلك دز مش كلمة سر يا سبايدرمان 🕷️",
        "دز نفسك عند محل الغاز 😂",
        "روح ذاكر بدل ما تدز، يمكن تنجح 📝",
        "اللي يدز بدز عليه ضعف! 🥷",
        "كفاية دز عشان الكيبورد اشتكى منك 🧠",
        "دز مرة كمان وهبلغ الشرطة 👮‍♂️",
        "دزني يا أخي كأننا في ساحة معركة! 🪖",
        "الكلمة دي لو كانت بتكسب ذهب كنا أغنياء دلوقتي 🪙",
        "خدلك دز على دماغك وارتاح 🧱",
        "كل يوم دز؟ يعني مافيش تطور؟ 🐌",
        "دزك جاي من مية نار ولا مية غسيل؟ 🔥",
        "دزك دا مش دز، دا نباح بصوت واطي 🐶",
        "دز دز، آخرها ترجع تبكي و تقول آسف 🧻",
        "إنت بتدز ولا بتسجل حضور؟ 😂"
      ];

      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      const boxedReply = `
╭── • 🎭 رد فخم على "دز" • ──╮
│
│ ${randomReply}
│
╰────────────────────────╯`;

      const imagePath = path.join(__dirname, "../media/blue.jpg");
      const imageBuffer = fs.existsSync(imagePath) ? fs.readFileSync(imagePath) : null;

      await sock.sendMessage(msg.key.remoteJid, {
        text: boxedReply,
        contextInfo: {
          externalAdReply: {
            title: "🎯 دزني كمان وشوف!",
            body: "رد فخم ساخر من مـــجـــهـــول BOT 👑",
            thumbnail: imageBuffer,
            mediaType: 1,
            sourceUrl: "https://t.me",
            renderLargerThumbnail: false,
            showAdAttribution: true
          }
        }
      }, { quoted: msg });

    } catch (error) {
      console.error("❌ خطأ في أمر 'دزو':", error);
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ حصل خطأ:\n${error.message || error.toString()}`
      }, { quoted: msg });
    }
  }
};