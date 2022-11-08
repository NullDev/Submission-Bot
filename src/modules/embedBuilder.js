import { MessageEmbed } from "discord.js";
import i18n from "i18n-light";

/**
 * Build Embed
 *
 * @param {import("discord.js").User} author
 * @param {String} banner
 * @param {String} description
 * @return {import("discord.js").MessageEmbed}
 */
const buildEmbed = function(author, banner, description){
    return new MessageEmbed()
        .setURL(banner)
        .setImage(banner)
        .setTitle(i18n.__("embed.submission_of", author.tag))
        .setDescription("Beschreibung: " + description)
        .setAuthor({
            name: author.tag,
            iconURL: author.displayAvatarURL(),
        })
        .setFooter({ text: i18n.__("embed.embed_footer") })
        .setColor("RANDOM");
};

export default buildEmbed;
