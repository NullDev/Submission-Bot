"use strict";

const { Client, Events, Intents, Message } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES] });

const config = require("../config.json");

const userAttachments = [];
let state;

client.on("ready", async() => {
    console.log(`Logged in as ${client.user?.tag}!`);
    client.user?.setActivity(config.activity, { type: "PLAYING" });

    // register new slash command
    await client.guilds.cache.get(config.guild)?.commands.create({
        name: "submit",
        description: "Bilder für den Contest submitten",
    });
});

// handle submit command
client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === "submit"){
        await interaction.reply({ content: "Check deine PN's!", ephemeral: true });

        // send DM to user
        const sent = await interaction.user.send({
            content:
`Hallo!
Hier kannst du deine Bilder submitten.
Wenn du es dir anders überlegst, schreibe einfach "stop"!

Bitte poste das **BANNER**:`,
        });
    }
    state = -1;
});

async function getAttachment(msg) {
    let attachment = msg.attachments.at(0);
    if(attachment.contentType === "image/png" || attachment.contentType === "image/gif") {
        if(state === 1) {
            userAttachments.find(entry => entry.username === msg.author.username).attachments.serverPic = attachment.url;
        } else if(state === -1) {
            userAttachments.find(entry => entry.username === msg.author.username).attachments.banner = attachment.url;
            await msg.channel.send("Als nächstes schicke bitte das Profilbild!");
            state = 1;
        }
        return;
    }
    await msg.channel.send("Das war weder ein Bild noch ein Gifs...willst du mich hacken oder so?");
}

client.on("messageCreate", async msg => {
    if(msg.author.bot) return;
    if(msg.content === "stop") {
        await channel.send("Ok, dann halt nicht :(");
        return;
    }

    if(msg.attachments.size < 1) {
        await msg.channel.send("Bruder, wo ist das Bild? Fang nochmal von vorne an...");
        return;
    }

    userAttachments.push({"username": msg.author.username, attachments: {}});
    
    getAttachment(msg);
    if(state == -1) return;

    const userContent = userAttachments.find(entry => entry.username === msg.author.username);
    // check if banner and profile pic are given
    if(!userContent.attachments.banner || !userContent.attachments.serverPic) {
        await msg.channel.send("Irgendwas ist mit den Anhängen falsch gelaufen...");
        return;
    }

    const contestChannel = client.channels.cache.get(config.send_to_channel);
    await contestChannel.send({
        files: [userContent.attachments.banner, userContent.attachments.serverPic]
    });
    
    // add reaction
    contestChannel.messages.fetch({limit: 1}).then(messages =>{
        const lastMessage = messages.first();
        lastMessage.react("⭐");
    });
    
});

client.login(config.token).then(() => {
    console.log("Logged in!");
});
