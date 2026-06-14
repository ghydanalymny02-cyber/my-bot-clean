module.exports = {
  command: ['كرة'],
  description: 'كرة السحر - اسأل سؤال',
  category: 'الألعاب',
  
  async execute(sock, msg, args) {
    // التحقق من وجود args
    const question = args ? args.join(' ') : '';
    
    if (!question || question.trim() === '') {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '🔮 **كرة السحر**\n\nاطرح سؤالاً وسأجيبك بنعم أو لا!\n\n📌 الاستخدام:\n.كرة هل سأنجح؟'
      });
    }
    
    const answers = [
      '✅ نعم بالتأكيد!',
      '❌ لا، مستحيل!',
      '🤔 ربما...',
      '✨ بالتأكيد نعم!',
      '😬 أعتقد لا',
      '🌟 نعم، بكل تأكيد!',
      '💫 نعم، ولكن بعد وقت',
      '⚡ لا، ليس الآن',
      '🌙 ربما في المستقبل',
      '🔥 أنا متأكد من نعم!'
    ];
    
    const answer = answers[Math.floor(Math.random() * answers.length)];
    
    await sock.sendMessage(msg.key.remoteJid, {
      text: `🔮 **كرة السحر تقول:**\n\nسؤالك: "${question}"\n\nالجواب: ${answer}`
    });
  }
};