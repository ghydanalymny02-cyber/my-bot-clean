  module.exports = {
  name: "تريمكس",
  command: ["تيرمكس"],
  category: "tools",
  description: "وصف الأمر هنا",
  
  async execute(sock, msg, args) {
    await sock.sendMessage(msg.key.remoteJid, { text: "البوت شغال تمام ✅" });
  },
};