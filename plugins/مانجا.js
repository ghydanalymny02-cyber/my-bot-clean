const axios = require('axios');

module.exports = {
  command: ['مانجا'],
  description: '📚 البحث عن مانجا وتحميل الفصول PDF',
  category: 'tools',

  async execute(sock, msg) {
    try {
      if (!sock.manga) sock.manga = {};
      const userId = msg.key.participant || msg.key.remoteJid;
      const body = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
      const args = body.trim().split(/ +/).slice(1); // بعد كلمة .ميلو
      const text = args.join(' ');
      const usedPrefix = '.'; // نفس البادئة اللي بتستعملها

      if (!text) {
        return sock.sendMessage(msg.key.remoteJid, {
          text: `📖 تعليمات الاستخدام:\n\n• للبحث:  ${usedPrefix}ميلو اسم المانجا\n• لاختيار المانجا:  ${usedPrefix}ميلو رقم\n• لاختيار الفصل:  ${usedPrefix}ميلو رقم الفصل`
        }, { quoted: msg });
      }

      if (!sock.manga[userId]) sock.manga[userId] = { state: 'idle' };

      // البحث عن مانجا
      if (sock.manga[userId].state === 'idle' && isNaN(text)) {
        const { data } = await axios.get(`https://itadori-dev-api-mauve.vercel.app/api/Download/manga/search?q=${encodeURIComponent(text)}`);

        if (!data.results || data.results.length === 0) {
          return sock.sendMessage(msg.key.remoteJid, { text: '❌ لا توجد نتائج للبحث' }, { quoted: msg });
        }

        sock.manga[userId] = {
          state: 'selected_manga',
          searchResults: data.results
        };

        let replyText = `🔍 نتائج البحث لـ *${text}*:\n\n`;
        data.results.forEach((manga, index) => {
          replyText += `${index + 1}. ${manga.title}\n`;
        });
        replyText += `\n✏️ رد برقم المانجا لرؤية الفصول`;

        return sock.sendMessage(msg.key.remoteJid, { text: replyText }, { quoted: msg });
      }

      // اختيار مانجا -> جلب الفصول
      if (sock.manga[userId].state === 'selected_manga') {
        const index = parseInt(text) - 1;
        if (isNaN(index) || index < 0 || index >= sock.manga[userId].searchResults.length) {
          return sock.sendMessage(msg.key.remoteJid, { text: '❌ رقم غير صحيح' }, { quoted: msg });
        }

        const mangaId = sock.manga[userId].searchResults[index].id;
        const { data } = await axios.get(`https://itadori-dev-api-mauve.vercel.app/api/Download/manga/${mangaId}/chapters`);

        if (!data.chapters || data.chapters.length === 0) {
          return sock.sendMessage(msg.key.remoteJid, { text: '❌ لا توجد فصول لهذه المانجا' }, { quoted: msg });
        }

        sock.manga[userId] = {
          state: 'selected_chapter',
          mangaId: mangaId,
          mangaTitle: data.title,
          chapters: data.chapters
        };

        let replyText = `📚 فصول *${data.title}*:\n\n`;
        data.chapters.forEach((chapter, idx) => {
          replyText += `${idx + 1}. ${chapter.title}\n`;
        });
        replyText += `\n✏️ رد برقم الفصل لتحميله PDF`;

        return sock.sendMessage(msg.key.remoteJid, { text: replyText }, { quoted: msg });
      }

      // اختيار فصل -> تحميل PDF
      if (sock.manga[userId].state === 'selected_chapter') {
        const index = parseInt(text) - 1;
        if (isNaN(index) || index < 0 || index >= sock.manga[userId].chapters.length) {
          return sock.sendMessage(msg.key.remoteJid, { text: '❌ رقم غير صحيح' }, { quoted: msg });
        }

        const chapter = sock.manga[userId].chapters[index];
        await sock.sendMessage(msg.key.remoteJid, { text: '⏳ جاري تحميل الفصل...' }, { quoted: msg });

        const response = await axios.get(
          `https://itadori-dev-api-mauve.vercel.app/api/Download/manga/${sock.manga[userId].mangaId}/chapter/${chapter.id}/pdf`,
          { responseType: 'arraybuffer' }
        );

        const pdfBuffer = Buffer.from(response.data);

        await sock.sendMessage(msg.key.remoteJid, {
          document: pdfBuffer,
          fileName: `${sock.manga[userId].mangaTitle} - ${chapter.title}.pdf`,
          mimetype: 'application/pdf'
        }, { quoted: msg });

        sock.manga[userId] = { state: 'idle' };
      }

    } catch (err) {
      console.error('🚫 خطأ في أمر ميلو:', err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: '⚠️ حصل خطأ أثناء تنفيذ الأمر.'
      }, { quoted: msg });
    }
  }
};