import promptUser from "./promptUser.js";
import buildEmbed from "./embedBuilder.js";

/* eslint-disable consistent-return */

const removeUser = id => global.submittingUsers.splice(global.submittingUsers.indexOf(id), 1);

/**
 * Start interaction
 *
 * @param {import("discord.js").CommandInteraction | import("discord.js").ButtonInteraction} interaction
 * @param {import("discord.js").Client} client
 * @param {Object} config
 * @return {Promise<void>}
 */
const startInteraction = async function(interaction, client, config){
    if (global.submittingUsers.includes(interaction.user.id)){
        return interaction.reply({ content: "Du hast grade schon eine laufende Submission. Schließe die erst ab bevor du ne weitere machst.", ephemeral: true});
    }

    await interaction.reply({ content: "Check deine PN's!", ephemeral: true });

    interaction.user.send(
        "Hallo!\nHier kannst du deine Bilder submitten.\nWenn du es dir anders überlegst, schreibe einfach \"stop\"!\n----",
    ).catch(() => {
        return interaction.reply({ content: "Du hast deine PN's deaktiviert!", ephemeral: true });
    });

    global.submittingUsers.push(interaction.user.id);

    const banner = await promptUser("Bitte poste das **BANNER**:", interaction, "img");
    if (!banner) return removeUser(interaction.user.id);

    const icon = await promptUser("Bitte poste das **ICON**:", interaction, "img");
    if (!icon) return removeUser(interaction.user.id);

    const description = await promptUser("Bitte poste eine kurze **BESCHREIBUNG**:", interaction, "text");
    if (!description) return removeUser(interaction.user.id);

    const embeds = buildEmbed(interaction.user, String(banner), String(icon), String(description));

    client.channels.cache.get(config.send_to_channel)?.fetch()
        .then(channel => channel.send({ embeds: [...embeds] })
            .then(message => message.react("⭐")).catch(() => console.log("No perms lol")));

    interaction.user.send("Dein Eintrag wurde erfolgreich gesendet!");

    removeUser(interaction.user.id);
};

export default startInteraction;
