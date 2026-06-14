module.exports = {
  command: 'فيروس',
  description: 'أمر وهمي يوهم بوجود فيروس يضرب الجروب 😈',
  usage: 'فيروس',
  category: 'fun',

  async execute(sock, msg) {
    const jid = msg.key.remoteJid;

    const send = (text, delay) => new Promise(resolve => setTimeout(async () => {
      await sock.sendMessage(jid, { text }, { quoted: msg });
      resolve();
    }, delay));

    // تسلسل الرعب 👻
    await send('🦠 جاري تحميل الفيروس...', 500);
    await send('📦 استخراج الملفات...', 1000);
    await send('⚠️ اختراق الجروب قيد التنفيذ...', 1200);
    await send('🔥 حذف الرسائل خلال 10 ثواني...', 1500);
    await send('💀 إصابة 3 أعضاء حتى الآن...', 1800);
    await send('🔴 تنبيه: الفيروس خارج السيطرة...', 2000);
    await send('😈 مبروك... تم خداعك بواسطة منظمة نيترو 🛰️', 2500);
  }
};