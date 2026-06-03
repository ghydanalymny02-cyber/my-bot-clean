
const { addKicked } = require('../haykala/dataUtils');

const developers = [
  '181020607422543',
  '967715677073',
];

module.exports = {
  status: "on",
  name: 'ضيف',
  command: 'ضيف',
  category: 'DEVELOPER',
  description: '➕ تسجيل عدد أعضاء كأنك طردتهم يدويًا (للمطور فقط)',

  async execute(sock, msg, args) {
    const chatId = msg.key.remoteJid;
    const sender = msg.key.participant || msg.key.remoteJid;
    const senderId = sender.split('@')[0];

    // 🔒 تحقق من صلاحية المطور
    if (!developers.includes(senderId)) {
      await sock.sendMessage(chatId, {
        react: { text: '🚫', key: msg.key }
      });
      return sock.sendMessage(chatId, {
        text: '🚫 هذا الأمر مخصص للمطور فقط!',
      }, { quoted: msg });
    }

    const text = msg.message?.extendedTextMessage?.text || msg.message?.conversation || msg.body || '';
    const numberMatch = text.match(/\.?ضيف\s+(\d+)/i);

    // ❌ إذا لم يكتب العدد
    if (!numberMatch) {
      await sock.sendMessage(chatId, {
        react: { text: '❌', key: msg.key }
      });
      return sock.sendMessage(chatId, {
        text: '❌ يرجى كتابة عدد الطرد. مثال:\n\n.ضيف 100',
      }, { quoted: msg });
    }

    const amount = parseInt(numberMatch[1]);

    // ⚙️ توليد معرفات فريدة بناء على الوقت
    const ids = Array.from({ length: amount }, (_, i) => Date.now() + i);

    const total = addKicked(ids);

    await sock.sendMessage(chatId, {
      react: { text: '✅', key: msg.key }
    });

    // ✅ رسالة النجاح
    await sock.sendMessage(chatId, {
      text: `✅ تم تسجيل *${amount}* طرد يدويًا بنجاح!\n📊 العدد الكلي الآن: *${total.toLocaleString()}*`,
    }, { quoted: msg });
  }
};


