const { Events, EmbedBuilder } = require("discord.js");
const Giveaway = require("../Schemas/giveawaySchema");

module.exports = {
    name: 'ready',
    async execute(client) {
        setInterval(async () => {
            try {
                const giveaways = await Giveaway.find();

                for (const giveaway of giveaways) {
                    if (!giveaway.ended) {
                        const now = Date.now();
                        if (now >= giveaway.endTime.getTime()) {
                            const channel = await client.channels.fetch(giveaway.channelId).catch(error => {
                                return; // Return null if the channel is not found
                            });

                            if (!channel) {
                                continue; // Skip to the next giveaway
                            }

                            const message = await channel.messages.fetch(giveaway.messageId).catch(error => {
                                return; // Return null if the message is not found
                            });

                            if (!message) {
                                continue; // Skip to the next giveaway
                            }

                            const winners = selectWinners(giveaway.participants, giveaway.winnersCount);
                            const winnersText = winners.map(winner => `<@${winner}>`).join(', ');
                            const announcement = `🎉 Congratulations to the winners: ${winnersText}!`;

                            const embed = new EmbedBuilder().setDescription(`Winner(s): ${winnersText}`).setColor("#00FF00").setTitle("Giveaway Ended").setFooter({ text: `${giveaway.id}` });

                            await message.edit({ embeds: [embed], components: [] });

                            await channel.send(announcement);

                            giveaway.ended = true;
                            await giveaway.save();
                        }
                    }
                }
            } catch (error) {
                console.error("Error in giveaway check:", error);
            }
        }, 1000);
    }
};

function selectWinners(participants, count) {
    for (let i = participants.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [participants[i], participants[j]] = [participants[j], participants[i]];
    }
    return participants.slice(0, count);
}
