const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, AttachmentBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('qc')
        .setDescription('Request Quality Control review')
        .addAttachmentOption(option =>
            option.setName('file')
                .setDescription('Upload the file for Quality Control review')
                .setRequired(true)),
    async execute(interaction) {
        console.log('Command executed by:', interaction.user.username);

        // Check if user is a Quality Control member
        if (!interaction.member.roles.cache.some(role => role.name === 'Quality Control')) {
            console.log('Access denied for:', interaction.user.username);
            return interaction.reply('Only Quality Control members can use this command.');
        }

        const file = interaction.options.getAttachment('file');

        // Safely try to delete the invoking message
        try {
            await interaction.deleteReply();
            console.log('Message deleted successfully');
        } catch (error) {
            console.error('Failed to delete the message:', error);
        }

        const roleID = "1233376426221109330"; // Update with actual role ID

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Quality Control Review Request')
            .setDescription(`<@${interaction.user.id}> has requested Quality Control review.`);
        
        console.log('Embed created:', embed.toJSON());

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('approve')
                    .setLabel('Approve')
                    .setStyle('3'),
                new ButtonBuilder()
                    .setCustomId('deny')
                    .setLabel('Deny')
                    .setStyle('4')
            );

        const attachment = new AttachmentBuilder(file.url);

        interaction.reply({
            content: `<@&${roleID}>`,
            embeds: [embed],
            files: [file],
            components: [row]
        }).then(async sentMessage => {
            console.log('Message sent with ID:', sentMessage.id);

            const filter = i => i.customId === 'approve' || i.customId === 'deny';
            const collector = sentMessage.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async i => {
                console.log('Button interaction collected:', i.customId);

                const response = i.customId === 'approve' ? 'approved' : 'denied';
                const userMessage = i.customId === 'approve' ?
                    'Your design has met our stringent quality control standards and is approved for delivery to the customer.' :
                    'Regrettably, your design did not meet our quality standards during our review process.';

                await interaction.user.send(userMessage).catch(() => null);
                console.log(`Notification sent to user: ${response}`);

                await i.update({
                    components: [row.components.map(button => {
                        if (button.customId === i.customId) {
                            return button.setDisabled(true).setStyle(button.style === 'SUCCESS' ? 'SECONDARY' : 'PRIMARY').setLabel(`${response.charAt(0).toUpperCase() + response.slice(1)} by ${interaction.user.username}`);
                        }
                        return button;
                    })]
                });
                console.log(`Buttons updated for interaction: ${i.id}`);

                collector.stop(); // Stop collecting after a response
                console.log('Collector stopped after handling an interaction');
            });

            collector.on('end', collected => {
                console.log('Collector ended, interactions collected:', collected.size);
                if (collected.size === 0) {
                    interaction.channel.send('Quality Control review request timed out.');
                    console.log('Collector timed out without any interactions');
                }
            });
        }).catch(error => {
            console.error('Error during interaction handling:', error);
        });
    },
};
