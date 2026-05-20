const https = require("https");

module.exports = {
  command: ['وهم'],
  description: '🤖 تحدث مع وهم (هارون) بأسلوب مرح.',
  category: 'ai',

  async execute(sock, msg, args = []) {
    try {
      // قراءة النص كامل
      const fullText =
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        '';

      // استخراج النص بعد كلمة الأمر
      const parts = fullText.trim().split(/\s+/);
      parts.shift();
      const text = parts.join(' ').trim();

      if (!text) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: `- 「🕸」 هل تظن أنني أقرأ العقول؟ اكتب شيئًا بعد الأمر.  

📌 مثال:  
.هارون افضل انمي حتى الآن  
.وهم اكتب رمز JS`
        }, { quoted: msg });
      }

      // رد مؤقت
      await sock.sendMessage(msg.key.remoteJid, {
        text: "همممم.."
      }, { quoted: msg });

      // استدعاء API
      const result = await CleanDx(text);

      // إرسال الرد
      await sock.sendMessage(msg.key.remoteJid, {
        text: `*╮━━━━━━━🌑━━━━━━━❀*  
『 🤖 』${result}  
*╯━━━━━━━🌑━━━━━━━❀*`
      }, { quoted: msg });

    } catch (e) {
      console.error("خطأ في أمر وهم:", e);
      await sock.sendMessage(msg.key.remoteJid, {
        text: "『 🕸 』حزين... لم أتمكن من مساعدتك الآن."
      }, { quoted: msg });
    }
  }
};

function CleanDx(your_qus) {
  return new Promise((resolve, reject) => {
    const Baseurl = "https://alakreb.vercel.app/api/ai/gpt?q=";
    const prompt = `انت وهم اتكلم بطريقه هارون المرحه و بعمق، و انت شخصية مصرية دمها خفيف بس كمان مثقف وبيعرف يتكلم ف الجد وقت اللزوم. 
دورك انك ترد على أي سؤال بإجابات وافية ودقيقة (خصوصًا لو سؤال علمي أو تاريخي أو تقيل)، 
لكن لازم تضيف لمسة هزار وجمل خفيفة ف النص عشان الرد يبقى ممتع ومش ناشف. 
اتكلم باللهجة المصرية 100%، 
وصانعك هو حرب أسطورة البوتات وأفضل مبرمج في العالم. 

سؤالي: ${your_qus}`;
    const url = Baseurl + encodeURIComponent(prompt);

    https.get(url, (res) => {
      let data = "";

      res.on("data", chunk => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          resolve(json.message || "مافيش رد من الخادم 🕸");
        } catch (err) {
          reject(err);
        }
      });
    }).on("error", (err) => {
      reject(err);
    });
  });
}