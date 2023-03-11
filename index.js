const { Api, TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { NewMessage } = require("telegram/events");
require("dotenv").config();
const apiId = parseInt(process.env.TELEGRAM_API_ID.trim());
const apiHash = process.env.TELEGRAM_API_HASH.trim();
// const channelFromTo = process.env.CHANNEL_FROM_TO.split(";");
const stringSession = new StringSession(process.env.STRING_SESSION.trim());
const input = require("input");
const cron = require("node-cron");
//let dateBR = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
const getDate = () => {
  return new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
};

// GRUPOS
const grupos = [
  "1747905543",
  "1631308861", // scream speed
];

async function chalk() {
  return (await import("chalk")).default;
}

// version
const version = process.env.VERSION;
let client;

// colors
async function msgColorBlue(message) {
  console.log((await chalk()).bgWhite.blue(">>>", message));
}

/**
 *
 * Main
 *
 * */
(async () => {
  client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });
  await client.start({
    phoneNumber: async () => await input.text("Phone number?"),
    password: async () => await input.text("Password?"),
    phoneCode: async () => await input.text("Phone Code?"),
    onError: (err) => console.log(err),
  });

  console.log("Your string session is:", client.session.save(), "\n");

  client.addEventHandler(onNewMessage, new NewMessage({}));

  // client.addEventHandler(async (update) => {
  //   let id, editMsg, isGroup, canal;

  //   //console.log(update)
  //   for (let name in update.message) {
  //     if (update.message.hasOwnProperty("editDate")) {
  //       canal = update.message.peerId.channelId.value;
  //       isGroup = grupos.some((item) => item == Number(canal));
  //       editMsg = update.message.editDate;
  //       //console.log(update.message.message)
  //       //console.log(isGroup)
  //       //console.log(canal)
  //       //if (isGroup) console.log(isGroup)
  //       //console.log(update.message.peerId.channelId.value)
  //     }
  //   }

  //   if (editMsg && isGroup) {
  //     let msg = update.message.message;
  //     const regex = /Moeda+|bet365\.com\/\#\/AVR\//gi;

  //     if (regex.test(msg)) {
  //       const content = await msgTransform(msg);

  //       msgColorBlue(`${getDate()} Nova atualização enviada`);

  //       await client.sendMessage("https://t.me/reidospeedwaytips", {
  //         message: content,
  //         parseMode: "markdown",
  //       });

  //       return;
  //     }
  //   }
  // });

  //client.addEventHandler(onNewMessage, new EditedMessage({}));

  //console.log('\n', chalk.yellow(">>> Waiting for telegram notification to buy..."));
  //console.log((await chalk()).yellow(">>>", "Waiting for telegram notification to buy..."));
  console.log(`${getDate()} Waiting for telegram notification...`);

  //if (test === 'true') console.log('MODO DE TESTE BINANCE TESTNET!')
})();

async function onNewMessageBinanceFutures(message) {
  let channels = null;
  const isChannel = message.peerId.className === "PeerChannel";
  const content = message.message;

  console.log("isChannel: " + isChannel);

  // validação por canal
  let channelBinanceFutures = null;

  if (isChannel) {
    // if Channel
    channelBinanceFutures = message.peerId.channelId;
  } else {
    // if Group
    channelBinanceFutures = message.peerId.chatId;
  }

  const channel = grupos.some((item) => item == channelBinanceFutures);
  const arrayFutures = message.message.toUpperCase().trim().split(/\n/g);

  console.log("channel: " + channel);
  //

  if (channel) {
    try {
      //await new Promise(r => setTimeout(r, 3000));

      if (content.includes("🐺 Lobo da SpeedWay 🐺")) {
        message.message = message.message.replace(
          /🐺 Lobo da SpeedWay 🐺/gi,
          `𝐏𝐑𝐈𝐌𝐄 𝐒𝐏𝐄𝐄𝐃𝐖𝐀𝐘`
        );

        msgColorBlue(`${getDate()} Nova dica enviada para Rei do SpeedWayTips`);

        await client.sendMessage("https://t.me/speedwaybet365tips", {
          message: message,
          parseMode: "markdown",
        });

        return;
      }

      if (content.includes("https://www.bet365.com/#/AVR/")) {
        //console.log(message.message)
        message.message = message.message
          .replace(/CARLOS/gi, `𝐏𝐑𝐈𝐌𝐄 𝐒𝐏𝐄𝐄𝐃𝐖𝐀𝐘`)
          .replace(/👑💀 𝐙𝐈𝐙𝐔 𝐒𝐏𝐄𝐄𝐃𝐖𝐀𝐘 💀👑/gi, `👑 𝐏𝐑𝐈𝐌𝐄 𝐒𝐏𝐄𝐄𝐃𝐖𝐀𝐘 👑`)
          .replace(/ZIZU/gi, `𝐏𝐑𝐈𝐌𝐄 𝐒𝐏𝐄𝐄𝐃𝐖𝐀𝐘`)
          .replace(/𝐙𝐈𝐙𝐔/gi, `𝐏𝐑𝐈𝐌𝐄 𝐒𝐏𝐄𝐄𝐃𝐖𝐀𝐘`)
          .replace(/𝐒𝐂𝐑𝐄𝐀𝐌 𝐒𝐏𝐄𝐄𝐃 🎭/gi, `𝐏𝐑𝐈𝐌𝐄 𝐒𝐏𝐄𝐄𝐃𝐖𝐀𝐘`)
          .replace(/SCREAM SPEED/gi, `𝐏𝐑𝐈𝐌𝐄 𝐒𝐏𝐄𝐄𝐃𝐖𝐀𝐘`)
          .replace(/TOP SPEED SIGNALS/gi, `𝐏𝐑𝐈𝐌𝐄 𝐒𝐏𝐄𝐄𝐃𝐖𝐀𝐘`)
          .replace(/BOT SHELBY/gi, `𝐏𝐑𝐈𝐌𝐄 𝐒𝐏𝐄𝐄𝐃𝐖𝐀𝐘`)
          .replace(/DA PRI/gi, `𝐏𝐑𝐈𝐌𝐄 𝐒𝐏𝐄𝐄𝐃𝐖𝐀𝐘`)
          .replace(/CARLÃO|𝐂𝐀𝐑𝐋𝐀̃𝐎/gi, `𝐏𝐑𝐈𝐌𝐄 𝐒𝐏𝐄𝐄𝐃𝐖𝐀𝐘`)
          .replace(/SPEED SIGNALS/gi, `𝐏𝐑𝐈𝐌𝐄 𝐒𝐏𝐄𝐄𝐃𝐖𝐀𝐘`)
          .replace(/ROBÔ SPEED SIGNALS/gi, `ROBÔ 𝐏𝐑𝐈𝐌𝐄 𝐒𝐏𝐄𝐄𝐃𝐖𝐀𝐘`);

        msgColorBlue(`${getDate()} Nova dica enviada para Rei do SpeedWayTips`);

        await client.sendMessage("https://t.me/speedwaybet365tips", {
          message: message,
          parseMode: "markdown",
        });

        return;
      }

      if (content.includes("https://www.bet365.com/#/AC")) {
        //console.log(message.message)

        // msgColorBlue(`${getDate()} Nova dica enviada para Bet365 Dicas VIP!`);

        // await client.sendMessage('-1001720347847', {
        //  message: message, parseMode: 'markdown'
        // })

        return;
      }
    } catch (e) {
      console.log(e);
    }
  }

  console.log(`${getDate()} Aguardando tips!`);
}

// Functions
async function msgTransform(msg) {
  let content = msg;

  content = content
    .replace(/CARLOS/gi, `𝐏𝐑𝐈𝐌𝐄 𝐒𝐏𝐄𝐄𝐃𝐖𝐀𝐘`)
    .replace(/👑💀 𝐙𝐈𝐙𝐔 𝐒𝐏𝐄𝐄𝐃𝐖𝐀𝐘 💀👑/gi, `👑 𝐏𝐑𝐈𝐌𝐄 𝐒𝐏𝐄𝐄𝐃𝐖𝐀𝐘 👑`)
    .replace(/ZIZU/gi, `𝐏𝐑𝐈𝐌𝐄 𝐒𝐏𝐄𝐄𝐃𝐖𝐀𝐘`)
    .replace(/𝐙𝐈𝐙𝐔/gi, `𝐏𝐑𝐈𝐌𝐄 𝐒𝐏𝐄𝐄𝐃𝐖𝐀𝐘`)
    .replace(/𝐒𝐂𝐑𝐄𝐀𝐌 𝐒𝐏𝐄𝐄𝐃 🎭/gi, `𝐏𝐑𝐈𝐌𝐄 𝐒𝐏𝐄𝐄𝐃𝐖𝐀𝐘`)
    .replace(/SCREAM SPEED/gi, `𝐏𝐑𝐈𝐌𝐄 𝐒𝐏𝐄𝐄𝐃𝐖𝐀𝐘`)
    .replace(/TOP SPEED SIGNALS/gi, `𝐏𝐑𝐈𝐌𝐄 𝐒𝐏𝐄𝐄𝐃𝐖𝐀𝐘`)
    .replace(/BOT SHELBY/gi, `𝐏𝐑𝐈𝐌𝐄 𝐒𝐏𝐄𝐄𝐃𝐖𝐀𝐘`)
    .replace(/DA PRI/gi, `𝐏𝐑𝐈𝐌𝐄 𝐒𝐏𝐄𝐄𝐃𝐖𝐀𝐘`)
    .replace(/CARLÃO/gi, `𝐏𝐑𝐈𝐌𝐄 𝐒𝐏𝐄𝐄𝐃𝐖𝐀𝐘`)
    .replace(/SPEED SIGNALS/gi, `𝐏𝐑𝐈𝐌𝐄 𝐒𝐏𝐄𝐄𝐃𝐖𝐀𝐘`)
    .replace(/ROBÔ SPEED SIGNALS/gi, `ROBÔ 𝐏𝐑𝐈𝐌𝐄 𝐒𝐏𝐄𝐄𝐃𝐖𝐀𝐘`)
    .replace(/DUVIDAS\?/gi, `ROBÔ 𝐏𝐑𝐈𝐌𝐄 𝐒𝐏𝐄𝐄𝐃𝐖𝐀𝐘`)
    .replace(/@Suporte_peakyblinders/gi, `ROBÔ 𝐏𝐑𝐈𝐌𝐄 𝐒𝐏𝐄𝐄𝐃𝐖𝐀𝐘`);

  return content;
}
/**
 *
 * Recieved new Telegram message
 *
 * */
async function onNewMessage(event) {
  const message = event.message;
  onNewMessageBinanceFutures(message);
}
