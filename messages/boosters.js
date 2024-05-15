// Import necessary modules
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

// Command handler function
module.exports = {
    name: 'boosters',
    description: 'Request boosts from members',
    async execute(message, args) {
        console.log('Command executed by:', message.author.username); // Log who executed the command

        // Create the embed message
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Boost(s) Needed!')
            .setDescription('Please grace us with your boosts, we\'d really appreciate it!')
            .addFields('Ping:', 'Port boosters and premium role.');

        console.log('Embed created:', embed.toJSON()); // Log the embed details

        const actionRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('boost')
                    .setLabel('Boost')
                    .setStyle('3')
            );

        console.log('Action row created:', actionRow.toJSON()); // Log the action row details

        // Replace 'roleId1' with the ID of the "Port Boosters" role
        const portBoostersRoleId = '1239492158205988935';

        // Replace 'roleId2' with the ID of the "Premium" role
        const premiumRoleId = '1239492118246985738';

        // Send a message mentioning both roles
        message.channel.send(`<@&${portBoostersRoleId}> <@&${premiumRoleId}>`, { embeds: [embed], components: [actionRow] })
            .then(sentMessage => {
                console.log('Message sent with ID:', sentMessage.id); // Log the sent message ID
            })
            .catch(error => {
                console.error('Error sending the message:', error); // Log any errors
            });
    },
};
