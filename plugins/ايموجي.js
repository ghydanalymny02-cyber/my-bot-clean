const emojiGames = {};
const emojis = [
  "😀","😃","😄","😁","😆","😅","😂","🤣","😊","😇",
  "🙂","🙃","😉","😌","😍","🥰","😘","😗","😙","😚",
  "😋","😛","😝","😜","🤪","🤨","🧐","🤓","😎","🤩",
  "🥳","😏","😒","😞","😔","😟","😕","🙁","☹️","😣",
  "😖","😫","😩","🥺","😢","😭","😤","😠","😡","🤬",
  "🤯","😳","🥵","🥶","😱","😨","😰","😥","😓","🤗",
  "🤔","🤭","🤫","🤥","😶","😐","😑","😬","🙄","😯",
  "😦","😧","😮","😲","🥱","😴","🤤","😪","😵","🤐",
  "🥴","🤢","🤮","🤧","😷","🤒","🤕","🤑","🤠","😈",
  "👿","👹","👺","🤡","💩","👻","💀","☠️","👽","👾",
  "🤖","🎃","😺","😸","😹","😻","😼","😽","🙀","😿",
  "😾","👐","🙌","👏","🙏","🤝","👍","👎","👊","✊",
  "🤛","🤜","🤞","✌️","🤟","🤘","👌","👈","👉","👆",
  "🖕","👇","☝️","✋","🤚","🖐️","🖖","👋","🤙","💪"
];

const gameSettings = {
  timeout: 40000 // 40 ثانية
};

module.exports = {
  command: "ايموجي",
  description: "لعبة الإيموجي: أول من يرسل الإيموجي يفوز",
  category: "العاب",

  async execute(sock, msg, args) {
    const chatId = msg.key.remoteJid;

    if (emojiGames[chatId]) return sock.sendMessage(chatId, {
      text: "❌ هناك لعبة ايموجي جارية بالفعل!"
    }, { quoted: msg });

    const chosenEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    emojiGames[chatId] = {
      emoji: chosenEmoji,
      finished: false,
      timer: null
    };

    await sock.sendMessage(chatId, {
      text: `🎮 لعبة ايموجي بدأت!\nأرسل هذا الإيموجي أولًا لتفوز:\n${chosenEmoji} ...🚀`,
    }, { quoted: msg });

    // مؤقت انتهاء اللعبة بعد 40 ثانية
    emojiGames[chatId].timer = setTimeout(async () => {
      if (!emojiGames[chatId].finished) {
        emojiGames[chatId].finished = true;
        await sock.sendMessage(chatId, { text: `⏰ انتهى الوقت! لم يرسل أحد الإيموجي في الوقت المحدد.` });
        delete emojiGames[chatId];
      }
    }, gameSettings.timeout);

    // الاستماع للرسائل الجديدة
    const listener = async ({ messages }) => {
      const m = messages[0];
      const fromChat = m.key.remoteJid;
      const player = m.key.participant || m.key.remoteJid;
      const text = m.message?.conversation?.trim();

      if (!text || !emojiGames[fromChat] || emojiGames[fromChat].finished) return;

      const game = emojiGames[fromChat];

      if (text.includes(game.emoji)) {
        clearTimeout(game.timer);
        game.finished = true;
        await sock.sendMessage(fromChat, {
          text: `🏆 الفائز هو: @${player.split('@')[0]} 🎉\nالإيموجي كان: ${game.emoji}`,
          mentions: [player]
        });
        delete emojiGames[fromChat];
      }
    };

    sock.ev.on('messages.upsert', listener);
  }
};