const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../data/complaints.json');
const devJid = '201116880068@s.whatsapp.net';

if (!fs.existsSync(file)) fs.writeFileSync(file, '[]');

module.exports = {
  command: "شكوى",
  description: "📢 إرسال شكوى لإدارة البوت",
  category: "tools",
  usage: ".شكوى [نص الشكوى]",

  async execute(sock, msg) {
    const args = msg.args || [];
    const from = msg.key.remoteJid;
    const name = msg.pushName || "عضو مجهول";
    const sender = msg.participant || msg.key.participant || msg.key.remoteJid;

    const complaint = args.join(" ").trim();

    if (!complaint) {
      return await sock.sendMessage(from, {
        text: "📢 اكتب شكواك بعد الأمر.\nمثال: `.شكوى في عضو بيبعت سبام`"
      }, { quoted: msg });
    }

    const list = JSON.parse(fs.readFileSync(file));
    list.push({
      name,
      complaint,
      from: sender,
      date: new Date().toLocaleString("ar-EG")
    });
    fs.writeFileSync(file, JSON.stringify(list, null, 2));

    await sock.sendMessage(from, {
      text: "✅ شكواك تم تسجيلها وتم إرسالها للإدارة.\n📌 شكراً لتعاونك!"
    }, { quoted: msg });

    await sock.sendMessage(devJid, {
      text: `📩 *شكوى جديدة من ${name}*\n\n📬 من: wa.me/${sender.split("@")[0]}\n📢 الشكوى:\n${complaint}`
    });
  }
};