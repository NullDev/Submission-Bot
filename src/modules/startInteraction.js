import promptUser from "./promptUser.js";
import buildEmbed from "./embedBuilder.js";

/**
 * Start interaction
 *
 * @param {import("discord.js").CommandInteraction | import("discord.js").ButtonInteraction} interaction
 * @param {import("discord.js").Client} client
 * @param {Object} config
 * @return {Promise<void>}
 */
const startInteraction = async function(interaction, client, config){
    await interaction.reply({ content: "Check deine PN's!", ephemeral: true });

    interaction.user.send(
        "Hallo!\nHier kannst du deine Bilder submitten.\nWenn du es dir anders überlegst, schreibe einfach \"stop\"!\n----",
    );

    const banner = await promptUser("Bitte poste das **BANNER**:", interaction, "img");
    if (!banner) return;

    const icon = await promptUser("Bitte poste das **ICON**:", interaction, "img");
    if (!icon) return;

    const description = await promptUser("Bitte poste eine kurze **BESCHREIBUNG**:", interaction, "text");
    if (!description) return;

    const embeds = buildEmbed(interaction.user, String(banner), String(icon), String(description));

    client.channels.cache.get(config.send_to_channel)?.fetch()
        .then(channel => channel.send({ embeds: [...embeds] })
            .then(message => message.react("⭐")));

    interaction.user.send("Dein Eintrag wurde erfolgreich gesendet!");
};

export default startInteraction;
