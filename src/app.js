"use strict";

const { Client, Intents } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const config = require("../config.json");

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
});

client.login(config.token).then(() => {
    console.log("Logged in!");
});
