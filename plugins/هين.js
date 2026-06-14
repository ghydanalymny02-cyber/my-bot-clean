// *كود من عمو اسكانور المظ 🫦*
// 📄 *هين.js* (جزء 1/1):

const { extractPureNumber } = require('../haykala/elite');

module.exports = {
  command: ['هين'],
  description: 'اهانه صغيره لطيفه',
  category: 'مضحك',

  async execute(sock, msg, args) {
    const jid = msg.key.remoteJid;
    const isQuoted = msg.message?.extendedTextMessage?.contextInfo?.participant;
    const mentionedJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

    let targetMention = '';

    if (mentionedJid.length > 0) {
      targetMention = `@${extractPureNumber(mentionedJid[0])}`;
    } else if (isQuoted) {
      targetMention = `@${extractPureNumber(isQuoted)}`;
    }

    // 🔥 قائمة الإهانات العشوائية المضافة
    const insults = [
      "مكسل ارد على واحد ما يسوى كيس شيبس فاضي 🎒🥔",
      "انا اتناقش مع جدار ولا اتناقش معك 🚧🥱",
      "لو الغباء فلوس، انت البنك المركزي 💰🏦",
      "وجودك مثل ايميل السبام، الكل يحذفه بدون قراءة 📩❌",
      "شخصيتك مثل بطارية قديمة، تفضى بسرعة وما لها فايدة 🔋🪫",
      "كلامك مثل اعلان يوتيوب، الكل يسوي له تخطي ⏭️📺",
      "شكلك انولد من واي فاي ضعيف يقطع كل كلمتين 📡💀",
      "IQ حقك أقل من حرارة المكيف عندي 🧊🤏",
      "لسانك اطول من سلك الشاحن ودايم يخرب الجو 🔌🐍",
      "تحس نفسك رهيب؟ حتى الظل يطفش منك 🕳️🚶‍♂️",
      "لا تهايط، التاريخ ما يسجّل اسماء المؤقتين ⌛🪦",
      "تحسب انك ذكي؟ حتى المنبه ما يصحى على كلامك ⏰🧠❌",
      "انت تعريف كلمة 'تحديث فاشل' بالنظام 🧩🖥️",
      "ما اطول كلامي مع واحد كيبورده ما يكتب غير نباح 🐕⌨️",
      "وجودك مثل لاق بالشات، الكل ينتظر يختفي 🗿📉",
      "لو الغباء عملة، انت السبب في التضخم 📈🤦‍♂️",
      "حتى السيرفر يطفش لما تدخل عليه 🚫💻",
      "شخصيتك نسخة تجريبية فيها أخطاء برمجية 🧬🐛",
      "لا تتعب نفسك بالكلام، محد يفهم لهجة الفشله 🧭🚮",
      "تبي تسوي سالفه؟ السالفه تستحي تطلع منك 🤫🚯",
      "هاوشني لما توصل لمستوى القهوه اللي اشربها ☕🗿",
      "انت سبب ارتفاع ضغط الدم في الكوكب 🌍📈",
      "فيه ناس ينحط لهم تاج، وفيه ناس مثلك ينحط لهم سطل 🪣👑",
      "حتى القهر يستكثر يضيع عليك 😤🚫",
      "روح صلح شخصيتك اول بعدين تعال 🧰🛠️",
      "كلامك مثل سبام، حتى الحظر يطفش منك 🚮🔒",
      "لا تسولف كثير، حتى الهوا يمل منك 🌬️🚷",
      "شكلك مثل غلط املائي بالحياة ✍️❌",
      "ياخي حتى الtoken يهرب منك 🏃‍♂️💾",
      "لو فيه DNS للبشر، انت 404 ❌🌐"
    ];

    const randomInsult = insults[Math.floor(Math.random() * insults.length)];

    // ☣️ صيغة الرد بعد اختيار الإهانة
    const shkhra = `
${targetMention}
${randomInsult} يكلب 🚬🍷 
𝑬𝑺𝑪𝑨𝑵𝑶𝑹⊰𝑩𝑶𝑻 🌋`.trim();

    await sock.sendMessage(jid, {
      text: shkhra,
      mentions: mentionedJid.length > 0 ? mentionedJid : isQuoted ? [isQuoted] : [],
    }, {
      quoted: msg,
    });
  }
};