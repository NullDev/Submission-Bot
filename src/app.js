"use strict";

// Dependencies
const { Client, Intents, MessageActionRow, MessageButton } = require("discord.js");

// Utils
const startInteraction = require("./modules/startInteraction");

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES],
});

const config = require("../config.json");

client.on("ready", async() => {
    console.log(`Logged in as ${client.user?.tag}!`);
    client.user?.setActivity(config.activity, { type: "PLAYING" });

    await client.guilds.cache.get(config.guild)?.commands.create({
        name: "submit",
        description: "Bilder für den Contest submitten",
    });

    await client.guilds.cache.get(config.guild)?.commands.create({
        name: "createbutton",
        description: "Erstellt einen Button zum Submitten",
    });
});

client.on("interactionCreate", async interaction => {
    if (interaction.isCommand()){
        if (interaction.commandName === "createbutton"){
            if (interaction.user.id !== config.admin) return;

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId("submit")
                        .setLabel("Einreichen")
                        .setStyle("PRIMARY"),
                );

            await interaction.channel?.send({
                content: "Klicke auf den Button um eine Submission zu starten!\nFalls das nicht funktioniert, versuch `/submit`",
                components: [row],
            });

            await interaction.reply({ content: "Button erstellt!", ephemeral: true });
        }

        if (interaction.commandName === "submit") startInteraction(interaction, client, config);
    }
    else if (interaction.isButton() && interaction.customId === "submit"){
        startInteraction(interaction, client, config);
    }
});

client.login(config.token).then(() => console.log("Logged in!"));
