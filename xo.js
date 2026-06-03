const fs = require('fs');
const path = require('path');

const activeDir = path.join(__dirname, '..', 'data');
const activeFile = path.join(activeDir, 'activeGames.json');

if (!fs.existsSync(activeDir)) fs.mkdirSync(activeDir);
if (!fs.existsSync(activeFile)) fs.writeFileSync(activeFile, JSON.stringify({}));

function loadActiveGames() {
  return JSON.parse(fs.readFileSync(activeFile));
}

function saveActiveGames(data) {
  fs.writeFileSync(activeFile, JSON.stringify(data, null, 2));
}

class TicTacToe {
  constructor(playerX, playerO, isBot = false) {
    this.board = Array(9).fill('➖');
    this.playerX = playerX;
    this.playerO = playerO;
    this.turn = 'X';
    this.isBot = isBot;
    this.gameOver = false;
  }

  getBoard() {
    return `
╭─🎮 *لعبة إكس-أو* 🎮
│ 👥 اللاعب ❌: @${this.playerX.split('@')[0]}
│ 👥 اللاعب ⭕: ${this.playerO === 'BOT' ? '🤖 بوت' : '@' + this.playerO.split('@')[0]}
│ 🎯 الدور على: *${this.turn === 'X' ? '❌' : '⭕'}*
│ ⏳ لديك 30 ثانية للرد!
╰─────────────────
${this.board.slice(0, 3).join('')}   1️⃣2️⃣3️⃣
${this.board.slice(3, 6).join('')}   4️⃣5️⃣6️⃣
${this.board.slice(6).join('')}   7️⃣8️⃣9️⃣
📩 أرسل رقم الخانة (1 - 9) للعب.
`.trim();
  }

  play(position, player) {
    if (this.gameOver) return { error: '❗ اللعبة انتهت بالفعل.' };

    if (this.turn === 'X' && player !== this.playerX)
      return { error: '❌ ليس دورك.' };

    if (this.turn === 'O' && this.playerO !== 'BOT' && player !== this.playerO)
      return { error: '⭕ ليس دورك.' };

    if (isNaN(position) || position < 1 || position > 9)
      return { error: '❗ اختر رقم من 1 إلى 9.' };

    const idx = position - 1;
    if (this.board[idx] !== '➖')
      return { error: '❗ هذه الخانة مشغولة.' };

    this.board[idx] = this.turn === 'X' ? '❌' : '⭕';

    const winner = this.checkWinner();
    if (winner) {
      this.gameOver = true;
      return { win: winner };
    }

    if (this.board.every(cell => cell !== '➖')) {
      this.gameOver = true;
      return { draw: true };
    }

    this.turn = this.turn === 'X' ? 'O' : 'X';
    return { ok: true };
  }

  checkWinner() {
    const wins = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    for (const [a,b,c] of wins) {
      if (this.board[a] !== '➖' && this.board[a] === this.board[b] && this.board[b] === this.board[c]) {
        return this.board[a];
      }
    }
    return null;
  }
}

const games = {};
const timeouts = {};

module.exports = {
  command: 'اكس',
  category: 'fun',
  description: 'لعبة إكس أو ضد شخص أو البوت',
  async execute(sock, msg, args) {
    const chatId = msg.key.remoteJid;
    const sender = msg.key.participant || msg.key.remoteJid;
    const body = (msg.body || msg.message?.conversation || '').trim();

    const activeGames = loadActiveGames();
    if (activeGames[chatId]) {
      return sock.sendMessage(chatId, {
        text: '⚠️ هناك لعبة إكس-أو قيد التشغيل في هذه المجموعة بالفعل.'
      }, { quoted: msg });
    }

    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    let opponent;

    if (body.includes('بوت')) {
      opponent = 'BOT';
    } else if (mentioned.length === 1 && mentioned[0] !== sender) {
      opponent = mentioned[0];
    } else {
      return sock.sendMessage(chatId, {
        text: '❗ من تريد أن تلعب معه؟ منشنه أو اكتب "بوت" للعب مع البوت.'
      }, { quoted: msg });
    }

    const game = new TicTacToe(sender, opponent, opponent === 'BOT');
    games[chatId] = game;
    activeGames[chatId] = true;
    saveActiveGames(activeGames);

    async function sendBoard(extra = '') {
      await sock.sendMessage(chatId, {
        text: game.getBoard() + (extra ? '\n\n' + extra : ''),
        mentions: opponent !== 'BOT' ? [sender, opponent] : [sender]
      });
    }

    async function endGame(resultMessage) {
      clearTimeout(timeouts[chatId]);
      delete games[chatId];
      delete timeouts[chatId];
      delete activeGames[chatId];
      saveActiveGames(activeGames);
      await sock.sendMessage(chatId, {
        text: resultMessage,
        mentions: opponent !== 'BOT' ? [sender, opponent] : [sender]
      });
      sock.ev.off('messages.upsert', listener);
    }

    function startTimer() {
      clearTimeout(timeouts[chatId]);
      timeouts[chatId] = setTimeout(async () => {
        const loser = game.turn === 'X' ? game.playerX : game.playerO;
        const winner = game.turn === 'X' ? game.playerO : game.playerX;

        await endGame(`⌛ انتهى وقت الجولة!\n🏆 الفائز هو: ${winner === 'BOT' ? '🤖 البوت' : '@' + winner.split('@')[0]}`);
      }, 30 * 1000);
    }

    await sendBoard();
    startTimer();

    const listener = async (event) => {
      try {
        if (event.type !== 'notify') return;
        const msg2 = event.messages[0];
        if (!msg2.message) return;
        if (msg2.key.remoteJid !== chatId) return;

        const from = msg2.key.participant || msg2.key.remoteJid;
        const text = msg2.message.conversation || msg2.message?.extendedTextMessage?.text || '';

        if (!games[chatId] || game.gameOver) return;

        const result = game.play(parseInt(text), from);

        if (result.error) {
          // رسالة الخطأ لو اللاعب لعب على خانة مشغولة أو رقم غير صالح
          await sock.sendMessage(chatId, {
            text: result.error,
            mentions: [from]
          });
          return;
        }

        await sendBoard();
        startTimer();

        if (game.isBot && game.turn === 'O' && !game.gameOver) {
          const empty = game.board.map((v, i) => v === '➖' ? i : null).filter(v => v !== null);
          const botMove = empty[Math.floor(Math.random() * empty.length)];
          game.play(botMove + 1, 'BOT');
          await sendBoard();
        }

        if (game.gameOver) {
          const winnerPlayer = (result.win === '❌') ? game.playerX : game.playerO;
          const msgText = result.draw
            ? '⚠️ انتهت اللعبة بتعادل.'
            : `🏆 الفائز هو: ${winnerPlayer === 'BOT' ? '🤖 البوت' : '@' + winnerPlayer.split('@')[0]}`;

          await endGame(msgText);

          if (!result.draw) {
            const pointsPath = path.join(__dirname, '..', 'data', 'points.json');

            function loadPoints() {
              if (!fs.existsSync(pointsPath)) fs.writeFileSync(pointsPath, JSON.stringify({}));
              return JSON.parse(fs.readFileSync(pointsPath));
            }

            function savePoints(data) {
              fs.writeFileSync(pointsPath, JSON.stringify(data, null, 2));
            }

            const points = loadPoints();
            const winnerJid = winnerPlayer;
            const gain = game.isBot ? 100 : 200;
            points[winnerJid] = (points[winnerJid] || 0) + gain;
            savePoints(points);

            await sock.sendMessage(chatId, {
              text: `🎉 تم منح ${gain} نقطة للفائز ${winnerJid === 'BOT' ? '🤖 البوت' : '@' + winnerJid.split('@')[0]}!\n💰 رصيده الآن: ${points[winnerJid]} نقطة.`,
              mentions: winnerJid === 'BOT' ? [] : [winnerJid]
            });
          }
        }
      } catch (err) {
        console.error('خطأ في لعبة xo:', err);
      }
    };

    sock.ev.on('messages.upsert', listener);
  }
};