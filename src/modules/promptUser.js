/* eslint-disable consistent-return */

/**
 * Prompt user and await response
 *
 * @param {String} prompt
 * @param {import("discord.js").Interaction} interaction
 * @param {String} desired
 * @return {Promise<String|null|Function>}
 */
const promptUser = async function(prompt, interaction, desired){
    await interaction.user.send({ content: prompt });

    return new Promise((resolve) => {
        interaction.user.dmChannel?.awaitMessages({
            filter: m => m.author.id === interaction.user.id,
            max: 1,
            time: 30000,
            errors: ["time"],
        }).then(message => {
            const msg = message.first();
            if (!msg) return;

            if (String(msg.content).toLowerCase() === "stop"){
                interaction.user.send("Abgebrochen!");
                return resolve(null);
            }

            if (
                desired === "img"
                && (
                    msg.attachments.size === 0
                    || !["image/gif", "image/png", "image/jpg", "image/jpeg"].includes(String(msg.attachments.at(0)?.contentType))
                )
            ){
                interaction.user.send("Du hast kein Bild gesendet!");
                return resolve(promptUser(prompt, interaction, desired));
            }

            if (desired === "text" && !msg.content){
                interaction.user.send("Du hast keine Nachricht gesendet!");
                return resolve(promptUser(prompt, interaction, desired));
            }

            resolve(
                String(
                    desired === "img"
                        ? msg.attachments.first()?.url
                        : msg.content,
                ),
            );
        }).catch(() => {
            interaction.user.send("Zu langsam... Versuchs nochmal.");
            resolve(null);
        });
    });
};

export default promptUser;
