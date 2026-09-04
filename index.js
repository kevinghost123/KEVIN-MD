const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const pino = require("pino");
const config = require("./config");

async function startBot() {

  const { state, saveCreds } = await useMultiFileAuthState("./session");

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: "silent" })
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", ({ connection }) => {
    if (connection === "open") {
      console.log(`✅ ${config.botName} Connected`);
    }

    if (connection === "close") {
      console.log("❌ Connection Closed");
      startBot();
    }
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {

    const msg = messages[0];
    if (!msg.message) return;

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      "";

    if (!text.startsWith(config.prefix)) return;

    const command = text
      .slice(config.prefix.length)
      .split(" ")[0];

    if (command === "ping") {
      await sock.sendMessage(
        msg.key.remoteJid,
        { text: "🏓 KEVIN-MD Online ✅" }
      );
    }

  });
}

startBot();
