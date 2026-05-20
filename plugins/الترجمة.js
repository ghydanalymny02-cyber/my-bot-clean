const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'الترجمة',
  command: ['الترجمة'],
  category: 'tools',
  description: 'يترجم النص إلى لغات متعددة مع إرسال ملف صوتي بنفس طريقة كود العبد.',
  args: [],
  hidden: false,

  execute: async (sock, m, args) => {
    const groupId = m.key.remoteJid;

    const quotedText = extractQuotedText(m);  
    const directText = extractTextFromCommand(m);  
    const textToTranslate = quotedText || directText.text;  
    const selectedLangInput = directText.lang;  

    if (!textToTranslate) {  
      return sendMessage(sock, groupId, '❌ يرجى كتابة نص للترجمة أو الرد على رسالة تحتوي على نص.', m);  
    }  

    const targets = [  
      { code: 'en', flag: '🇬🇧', label: 'الانجليزية' },  
      { code: 'fr', flag: '🇫🇷', label: 'الفرنسية' },  
      { code: 'ru', flag: '🇷🇺', label: 'الروسية' },  
      { code: 'hi', flag: '🇮🇳', label: 'الهندية' },  
      { code: 'it', flag: '🇮🇹', label: 'الإيطالية' },  
      { code: 'zh-CN', flag: '🇨🇳', label: 'الصينية' },  
      { code: 'de', flag: '🇩🇪', label: 'الألمانية' },  
      { code: 'ja', flag: '🇯🇵', label: 'اليابانية' },  
      { code: 'ar', flag: '🇸🇦', label: 'العربية' },  
    ];  

    let selectedTargets = targets;  
    if (selectedLangInput) {  
      const langMatch = targets.find(  
        t =>  
          t.label.includes(selectedLangInput) ||  
          t.code === selectedLangInput ||  
          normalizeText(t.label) === normalizeText(selectedLangInput)  
      );  
      if (!langMatch) {  
        return sendMessage(sock, groupId, '❌ اللغة غير مدعومة.', m);  
      }  
      selectedTargets = [langMatch];  
    }  

    try {  
      const results = [];  
      for (const lang of selectedTargets) {  
        const translated = await translateText(textToTranslate, lang.code);  
        results.push({ ...lang, translated });  
      }  

      const message = results.map(r => `${r.flag} *${r.label}*:\n${r.translated}`).join('\n\n');  
      await sendMessage(sock, groupId, `🌐 *نتائج الترجمة:*\n\n${message}`, m);  

      for (const lang of results) {  
        await sendTTS(sock, groupId, lang.translated, lang.code, m);  
      }  

    } catch (error) {  
      console.error('❌ خطأ أثناء الترجمة:', error.message);  
      await sendMessage(sock, groupId, '❌ حدث خطأ أثناء الترجمة.', m);  
    }
  },
};

// === دوال مساعدة ===

function extractQuotedText(m) {
  const quoted = m.message.extendedTextMessage?.contextInfo?.quotedMessage;
  if (!quoted) return '';
  return (
    quoted.conversation ||
    quoted.extendedTextMessage?.text ||
    quoted.imageMessage?.caption ||
    quoted.videoMessage?.caption ||
    ''
  );
}

function extractTextFromCommand(m) {
  const body =
    m.message?.conversation ||
    m.message?.extendedTextMessage?.text ||
    '';
  const parts = body.trim().split(/\s+/).slice(1);
  if (!parts.length) return { lang: '', text: '' };
  return { lang: parts[0].toLowerCase(), text: parts.slice(1).join(' ') };
}

function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[ةه]/g, 'ه')
    .replace(/[ىي]/g, 'ي')
    .replace(/[اأإآ]/g, 'ا');
}

async function translateText(text, targetLanguage) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`;
  const resp = await axios.get(url);
  return resp.data[0][0][0];
}

async function sendMessage(sock, jid, text, quoted = null) {
  await sock.sendMessage(jid, { text }, { quoted });
}

async function sendTTS(sock, jid, text, lang, quotedMsg) {
  try {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;
    const resp = await axios.get(url, { responseType: 'arraybuffer' });
    const tmp = path.join(__dirname, `${lang}_tts.mp3`);
    fs.writeFileSync(tmp, resp.data);

    const audioBuffer = fs.readFileSync(tmp);

    await sock.sendMessage(
      jid,
      {
        audio: audioBuffer,
        mimetype: 'audio/mpeg',
        ptt: false, // ← زي العبد بالظبط (ملف صوت عادي مش فويس)
        contextInfo: {
          isForwarded: true,
          forwardingScore: 50,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363400192045844@newsletter",
            newsletterName: "❅𝑂⃝🍷 𝟕𝐀𝐑𝐁ｼ",
            serverMessageId: 888
          }
        }
      },
      { quoted: quotedMsg }
    );

    fs.unlinkSync(tmp);
  } catch (err) {
    console.error(`❌ فشل التوليد الصوتي (${lang}):`, err.message);
  }
}