module.exports = {
  name: "ping",
  description: "Check bot speed",

  run: async (sock, msg) => {
    await sock.sendMessage(
      msg.key.remoteJid,
      {
        text: "🏓 KEVIN-MD Online 🗿✅"
      }
    );
  }
};
