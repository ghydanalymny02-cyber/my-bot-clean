const axios = require('axios');
const baileys = require('@whiskeysockets/baileys');
const { generateWAMessageContent, generateWAMessageFromContent, proto } = baileys;

module.exports = {
  name: 'بنتر',
  command: 'بنتر',
  description: 'جلب صور من Pinterest بشكل عرض احترافي',
  category: 'tools',

  async execute(sock, msg, args = []) {
    try {
      const sender = msg.key.participant || msg.key.remoteJid;
      const jid = msg.key.remoteJid;

      // ===== بطاقة الاتصال (vCard) =====
      const vCard = `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${sender.split('@')[0]}:${sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`;
      const fkontak2 = {
        key: {
          participants: '963996097873@s.whatsapp.net',
          remoteJid: 'status@broadcast',
          fromMe: false,
          id: 'Halo'
        },
        message: {
          contactMessage: { vcard: vCard }
        },
        participant: '963996097873@s.whatsapp.net'
      };

      // ===== إعدادات القناة (Forwarded Newsletter Info) =====
      const forwardedNewsletterMessageInfo = {
        newsletterJid: '120363421676642756@newsletter',
        serverMessageId: 777,
            newsletterName: '❅𝑂⃝👑 ❄ مـــجـــهـــول  '
      };

      // ===== استخراج مصطلح البحث =====
      const searchTerm =
        args.join(' ').trim() ||
        msg.message?.conversation?.split(' ').slice(1).join(' ') ||
        msg.message?.extendedTextMessage?.text?.split(' ').slice(1).join(' ');

      if (!searchTerm) {
        return sock.sendMessage(jid, {
          text: "⚠️ أدخل مصطلح البحث.\n\nمثال: *.بنتر ويليام*"
        }, { quoted: msg });
      }

      await sock.sendMessage(jid, { react: { text: "⌛", key: msg.key } });
      await sock.sendMessage(jid, { text: '```⏳ جاري البحث عن الصور...```' }, { quoted: fkontak2 });

      // ===== استدعاء API =====
      const res = await axios.get(`https://api.siputzx.my.id/api/s/pinterest?query=${encodeURIComponent(searchTerm)}`);
      const results = res.data?.data?.filter(item => item.image_url && item.pin) || [];

      if (results.length === 0) {
        await sock.sendMessage(jid, { react: { text: "❌", key: msg.key } });
        return sock.sendMessage(jid, { text: `❌ لم يتم العثور على نتائج لـ *${searchTerm}*` }, { quoted: fkontak2 });
      }

      // ===== اختيار 6 صور عشوائية =====
      const selected = results.sort(() => 0.5 - Math.random()).slice(0, 6);

      async function createImageMessage(url) {
        const { imageMessage } = await generateWAMessageContent(
          { image: { url } },
          { upload: sock.waUploadToServer }
        );
        return imageMessage;
      }

      const imagesList = [];
      let counter = 1;

      for (let item of selected) {
        const imageMsg = await createImageMessage(item.image_url);

        imagesList.push({
          body: { text: `🔎 *نتيجة البحث عن:* ${searchTerm}\n📸 𝐏𝐇𝐎𝐓𝐎 ${counter++}` },
          header: { hasMediaAttachment: true, imageMessage: imageMsg },
          nativeFlowMessage: {
            buttons: [{
              name: "cta_url",
              buttonParamsJson: JSON.stringify({
                display_text: "فتح في Pinterest",
                url: item.pin
              })
            }]
          }
        });
      }
//حقوق ❅𝑂⃝🍷 𝑊𝐼𝐿𝐿𝐼𝐴𝑀⁩
//https://whatsapp.com/channel/0029Vb6Jm9nDDmFdUpWn3733
// +20 10 99800953 
      // ===== الرسالة النهائية =====
      const finalMessage = generateWAMessageFromContent(jid, {
        viewOnceMessage: {
          message: {
            interactiveMessage: {
              body: { text: "> 📸 *تم العثور على بعض الصور بواسطه ❅𝑂⃝🕸. ❄ مـــجـــهـــول  " },
              carouselMessage: { cards: imagesList },
              contextInfo: { forwardedNewsletterMessageInfo }
            }
          }
        }
      }, { quoted: fkontak2 });

      await sock.sendMessage(jid, { react: { text: "✅", key: msg.key } });
      await sock.relayMessage(jid, finalMessage.message, { messageId: finalMessage.key.id });

    } catch (err) {
      console.error(err);
      return sock.sendMessage(msg.key.remoteJid, {
        text: `❌ حدث خطأ أثناء تنفيذ الأمر:\n${err.message}`
      }, { quoted: msg });
    }
  }
};