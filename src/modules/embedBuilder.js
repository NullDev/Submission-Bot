import { MessageEmbed } from "discord.js";
import i18n from "i18n-light";

/**
 * Build Embed
 *
 * @param {import("discord.js").User} author
 * @param {String} banner
 * @param {String} icon
 * @param {String} description
 * @return {Array}
 */
const buildEmbed = function(author, banner, icon, description){
    const embed1 = new MessageEmbed()
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

    const embed2 = new MessageEmbed()
        .setURL(banner)
        .setImage(icon);

    return [embed1, embed2];
};

export default buildEmbed;
