import { Client, Events } from "../lib";

const bot = new Client({
    prefix: "!",
    printQRInTerminal: false,
    readIncommingMsg: true,
    usePairingCode: true,
    phoneNumber: '', // phone number, e.g 62xxxxx
    // phoneNumber: '6285220188676', // phone number, e.g 62xxxxx
    // phoneNumber: '6281234456', // phone number, e.g 62xxxxx
});

bot.ev.once(Events.ClientReady, (m) => {
    console.log(`ready at ${m.user.id}`);
});

bot.command('ping', async(ctx) => ctx.reply({ text: 'pong!' }));

bot.launch();