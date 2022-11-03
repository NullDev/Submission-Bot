"use strict";

const { MessageEmbed } = require("discord.js");

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
        .setTitle("Submission von " + author.tag)
        .setDescription("Beschreibung: " + description)
        .setAuthor({
            name: author.tag,
            iconURL: author.displayAvatarURL(),
        })
        .setFooter({ text: "Klicke auf die Bilder, um sie zu vergrößern!\nACHTUNG: Auf dem Handy sieht man nur das Banner!" })
        .setColor("RANDOM");

    const embed2 = new MessageEmbed()
        .setURL(banner)
        .setImage(icon);

    return [embed1, embed2];
};

module.exports = buildEmbed;
