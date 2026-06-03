module.exports = {
  category: 'tools',
  command: 'صورتي',
  description: 'الحصول على صورتك الشخصية',
  async execute(sock, msg) {
    const userJid = msg.key.participant || msg.key.remoteJid;
    
    try {
      const pfp = await sock.profilePictureUrl(userJid, 'image');
      await sock.sendMessage(msg.key.remoteJid, {
        image: { url: pfp },
        caption: '🖼️ صورتك الشخصية'
      }, { quoted: msg });
    } catch (error) {
      await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ لا توجد صورة شخصية متاحة'
      }, { quoted: msg });
    }
  }
};