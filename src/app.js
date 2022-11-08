import path from "node:path";

// Dependencies
import { Client, Intents, MessageActionRow, MessageButton } from "discord.js";
import i18n from "i18n-light";

// Utils
import startInteraction from "./modules/startInteraction.js";
import config from "../config.js";

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES],
});

i18n.configure({
    defaultLocale: "en",
    dir: path.resolve("./locales"),
    extension: ".json",
});

i18n.setLocale(config.language);

global.submittingUsers = [];

client.on("ready", async() => {
    console.log(i18n.__("app.logged_in", client.user?.tag));
    client.user?.setActivity(config.activity, { type: "PLAYING" });

    await client.guilds.cache.get(config.guild)?.commands.create({
        name: "submit",
        description: i18n.__("app.new_submission_command_description"),
    });

    await client.guilds.cache.get(config.guild)?.commands.create({
        name: "createbutton",
        description: i18n.__("app.create_button_command_description"),
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
                        .setLabel(i18n.__("app.new_submission_button_label"))
                        .setStyle("PRIMARY"),
                );

            await interaction.channel?.send({
                content: i18n.__("app.create_submission_button_description"),
                components: [row],
            });

            await interaction.reply({ content: i18n.__("app.created_button"), ephemeral: true });
        }

        if (interaction.commandName === "submit") startInteraction(interaction, client, config);
    }
    else if (interaction.isButton() && interaction.customId === "submit"){
        startInteraction(interaction, client, config);
    }
});

process.on("unhandledRejection", (err, promise) => {
    console.log("Unhandled rejection (promise: " + JSON.stringify(promise) + ", reason: " + err + ")");
});

client.login(config.token).then(() => console.log(i18n.__("app.token_login_sucess"))).catch(() => {
    console.log(i18n.__("app.token_rejected"));
    process.exit(1);
});
