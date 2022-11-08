import i18n from "i18n-light";

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
        return interaction.reply({ content: i18n.__("interaction.already_pending_submission"), ephemeral: true});
    }

    await interaction.reply({ content: i18n.__("interaction.check_dms"), ephemeral: true });

    interaction.user.send(i18n.__("interaction.user_greeting")).catch(() => {
        return interaction.reply({ content: i18n.__("interaction.dms_deactivated"), ephemeral: true });
    });

    global.submittingUsers.push(interaction.user.id);

    const image = await promptUser(i18n.__("interaction.post_the_image"), interaction, "img");
    if (!image) return removeUser(interaction.user.id);

    const description = await promptUser(i18n.__("interaction.post_the_decsription"), interaction, "text");
    if (!description) return removeUser(interaction.user.id);

    const embed = buildEmbed(interaction.user, String(image), String(description));

    client.channels.cache.get(config.send_to_channel)?.fetch()
        .then(channel => channel.send({ embeds: [embed] })
            .then(message => message.react("⭐")).catch(() => console.log(i18n.__("interaction.no_post_permission"))));

    interaction.user.send(i18n.__("interaction.submission_successful"));

    removeUser(interaction.user.id);
};

export default startInteraction;
