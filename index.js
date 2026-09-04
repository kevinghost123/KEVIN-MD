const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const pino = require("pino");
const config = require("./config");
const fs = require("fs");

const plugins = {};

fs.readdirSync("./plugins").forEach((file) => {
  if (file.endsWith(".js")) {
    const plugin = require("./plugins/" + file);
    plugins[plugin.name] = plugin;
  }
});

async function startBot() {

  const { state, saveCreds } = await useMultiFileAuthState("./session");

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: "silent" })
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", ({ connection }) => {
    if (connection === "open") {
      console.log("✅ KEVIN-MD Connected");
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
      .split(" ")[0]
      .toLowerCase();


    if (plugins[command]) {
      plugins[command].run(sock, msg);
    }

  });

}

startBot();
