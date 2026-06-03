module.exports = {
  command: ['معلوماتي'],
  description: 'عرض معلوماتك الشخصية',
  category: 'المستخدم',
  
  async execute(sock, msg) {
    const sender = msg.key.participant || msg.key.remoteJid;
    
    await sock.sendMessage(msg.key.remoteJid, {
      text: `👤 **معلومات حسابك**\n\n📞 الرقم: ${sender}\n📱 النظام: WhatsApp\n🕐 الوقت: ${new Date().toLocaleTimeString()}`
    });
  }
};