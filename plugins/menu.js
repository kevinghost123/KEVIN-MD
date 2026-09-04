module.exports = {
  name: "menu",
  description: "KEVIN-MD Menu",

  run: async (sock, msg) => {
    await sock.sendMessage(
      msg.key.remoteJid,
      {
        text:
`🔥 KEVIN-MD MENU 🔥

🎵 Song
.song
.play

📢 Channel
.channelinfo

🛠 Tools
.ping
.menu

👑 Owner
.owner

Version: 1.0`
      }
    );
  }
};
