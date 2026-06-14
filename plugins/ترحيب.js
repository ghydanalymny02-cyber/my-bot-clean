module.exports = {
  command: ['ترحيب'],
  description: 'إرسال رسالة ترحيب جميلة.',
  category: 'fun',

  async execute(sock, msg) {
    try {
      const chatId = msg.key.remoteJid;

      const text = `
❀✦═══ •『🔥』• ═══✦❀
⌝ مـرحـبـاً بـك بـيـن اخـوتـك ⌞
▣ ✍︎ نـورت أهـلاً و وطــئـت سـهـلاً يـا أيــهـا الـعـضـو/ة العـزيـز/ة 💫❤️
▣ ✍︎ نـحـن سـعـيـدون بإنـضـمـامـك إلـيـنـا و نـتـمـنـى مـنـك الـتـفـاعـل و الاحـتـرام وإضـافــة بـصـمـه رائـعـه لـلـقــروب 💗🐿

☆ اللقـ👤ـب: 『』
☆ منـشـ📧ـن: 『    』

☆ نرجو منك دخول الرابط التالي 🦋✨:
https://chat.whatsapp.com/FLJ8keucE7b495GSqCgkUI?mode=ems_copy_t
❀✦═══ •『🔥』• ═══✦❀
『H.🔥.U.💀.N.🌑.T.⚡.E.🌪.R』
`;

      await sock.sendMessage(chatId, { text }, { quoted: msg });
    } catch (err) {
      console.error('❌ خطأ في أمر .ترحيب:', err);
      await sock.sendMessage(msg.key.remoteJid, {
        text: "⚠️ حصل خطأ أثناء تنفيذ أمر الترحيب."
      }, { quoted: msg });
    }
  }
};