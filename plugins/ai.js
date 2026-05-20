const fs = require("fs").promises;
const path = require("path");
const axios = require("axios");

module.exports = {
  command: ["دجن"],
  description: "🤖 مساعد ذكي يولد أكواد، يرد على الأسئلة، ويعرض صور",
  category: "ai",

  async execute(sock, msg) {
    const apiKey = "AIzaSyD4FRqvb5z_SU9LWp7oBrbvp8SD1QaMIS8"; // مفتاح Gemini
    const groupId = msg.key.remoteJid;

    const fullText =
      msg.message?.conversation ||
      msg.message?.extendedTextMessage?.text ||
      msg.message?.imageMessage?.caption ||
      msg.message?.videoMessage?.caption || "";

    const question = fullText.replace(/^[,،.]?كينج\s*/i, "").trim();

    if (!question) {
      const examples = [
        "اكتب كود بايثون يحسب مجموع الأرقام",
        "اعمل كود أمر ترحيب",
        "ما الفرق بين list و tuple؟",
        "هات صور غوكو",
      ];
      const randomExample = examples[Math.floor(Math.random() * examples.length)];
      return await sock.sendMessage(groupId, {
        text: `🧠 اكتب سؤالك أو طلبك بعد كلمة "دجن"\nمثال: دجن ${randomExample}`,
      }, { quoted: msg });
    }

    // ✅ دعم جلب الصور
    if (/هات (صور|صورة)|عرض صور|صورة لـ/i.test(question)) {
      try {
        const keyword = question.replace(/(هات|عرض)?\s*(صور|صورة|صور لـ|صورة لـ)?/i, "").trim();
        const searchPage = await axios.get(`https://duckduckgo.com/?q=${encodeURIComponent(keyword)}&iax=images&ia=images`);
        const tokenMatch = searchPage.data.match(/vqd='([^']+)'/);
        if (!tokenMatch) throw new Error("فشل في الحصول على نتائج الصور");

        const vqd = tokenMatch[1];
        const imageSearch = await axios.get(
          `https://duckduckgo.com/i.js?l=ar-eg&o=json&q=${encodeURIComponent(keyword)}&vqd=${vqd}`,
          { headers: { 'User-Agent': 'Mozilla/5.0' } }
        );

        const results = imageSearch.data?.results || [];
        if (results.length === 0) {
          return await sock.sendMessage(groupId, {
            text: `❌ مفيش صور لـ "${keyword}"`,
          }, { quoted: msg });
        }

        for (const img of results.slice(0, 3)) {
          await sock.sendMessage(groupId, {
            image: { url: img.image },
            caption: keyword,
          }, { quoted: msg });
        }

        return;
      } catch {
        return await sock.sendMessage(groupId, {
          text: "⚠️ حصل خطأ أثناء جلب الصور.",
        }, { quoted: msg });
      }
    }

    // ✅ توليد كود أمر بصيغة البوت
    const matchCommand = question.match(/(?:اعمل|اكتب|صمم)\s*(?:كود)?\s*(?:أمر|امر)?\s*(\w+)(?:.*?يرد(?: بـ| ب)?\s*(.+))?/i);
    const autoAdd = /ضيف$/.test(question);

    if (matchCommand) {
      const cmdName = matchCommand[1].trim();
      const replyText = matchCommand[2]?.trim() || `✅ تم تنفيذ أمر ${cmdName}!`;

      const code = `
module.exports = {
  command: ["${cmdName}"],
  description: "✅ أمر ${cmdName}",
  category: "عام",

  async execute(sock, msg) {
    await sock.sendMessage(msg.key.remoteJid, {
      text: "${replyText}",
    }, { quoted: msg });
  }
};
      `.trim();

      // 🧠 حفظ تلقائي لو فيه "ضيف"
      if (autoAdd) {
        const filePath = path.join(__dirname, `../plugins/${cmdName}.js`);
        await fs.writeFile(filePath, code);
        await sock.sendMessage(groupId, {
          text: `✅ تم إنشاء الأمر "${cmdName}" وحفظه تلقائيًا!`,
        }, { quoted: msg });
      }

      // ✅ إرسال الكود + زر تجربة
      return await sock.sendMessage(groupId, {
        text: code,
        buttons: [
          {
            buttonId: `.${cmdName}`,
            buttonText: { displayText: "🚀 جرب الأمر" },
            type: 1,
          },
        ],
        footer: "⏤͟͟͞͞𝑫𝑱𝑵 AI",
        headerType: 1,
      }, { quoted: msg });
    }

    // ✅ غير كده.. نرد كذكاء صناعي ذكي
    await sock.sendMessage(groupId, {
      text: "🤖 بيفكر في رد مناسب...",
    }, { quoted: msg });

    const prompt = `
أنت مساعد ذكي جدًا وتفهم أوامر بصيغة بشرية عادية، حتى لو فيها أخطاء.
المطلوب منك هو الرد على السؤال أو تنفيذ الطلب التالي:
"${question}"
    `.trim();

    try {
      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        { contents: [{ parts: [{ text: prompt }] }] },
        { headers: { "Content-Type": "application/json" } }
      );

      let reply = res?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "❌ مفيش رد واضح";

      reply = reply
        .replace(/\*\*(.*?)\*\*/g, "*$1*")
        .replace(/```([a-z]*)\n([\s\S]*?)```/g, (_, lang, code) => `\`\`\`${lang}\n${code}\n\`\`\``)
        .replace(/`([^`]+)`/g, "`$1`")
        .replace(/\n{3,}/g, "\n\n");

      await sock.sendMessage(groupId, {
        text: reply,
      }, { quoted: msg });

    } catch (err) {
      console.error("❌ خطأ:", err.message);
      await sock.sendMessage(groupId, {
        text: "⚠️ حصل خطأ أثناء استخدام الذكاء الصناعي.",
      }, { quoted: msg });
    }
  },
};