const { SlashCommandBuilder, EmbedBuilder } = require('discord.js'); // Changed to MessageEmbed
const revSchema = require('../Schemas/reviewSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('review')
        .setDescription('Submit a review')
        .addUserOption(option =>
            option.setName('designer')
                .setDescription('Ping the designer')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('rating')
                .setDescription('Rating (1-5)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('product')
                .setDescription('Product')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('notes')
                .setDescription('Notes')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();

        const designer = interaction.options.getUser('designer');
        const rating = interaction.options.getInteger('rating');
        const product = interaction.options.getString('product');
        const notes = interaction.options.getString('notes');
        const customer = interaction.user.id;

        // Check if the rating is within the valid range (1-5)
        if (rating < 1 || rating > 5) {
            return interaction.editReply('Rating must be between 1 and 5.');
        }

        const designerPing = `<@${designer.id}>`;
        const customerMessage = `Review from <@${customer}>`;

        const embed = new EmbedBuilder()
            .addFields(
                { name: 'Designer', value: designerPing, inline: true },
                { name: 'Rating', value: rating.toString(), inline: true },
                { name: 'Product', value: product, inline: true },
                { name: 'Notes', value: notes, inline: true },
            )
            .setThumbnail(interaction.user.displayAvatarURL())
            .setFooter({ text: 'Design Port' });// Updated to use an object

        const sub = 'leave'; // Hardcode 'leave' subcommand as it's the only one used in this integration

        const data = await revSchema.findOne({ Guild: interaction.guild.id });

        if (!data) {
            return interaction.editReply({ content: `${customerMessage}`, embeds: [embed], ephemeral: true });
        } else {
            const member = interaction.user.tag;

            const embed1 = new EmbedBuilder()
                .setColor('#313338')
                .setDescription(`Review from ${member}`)
                .addFields(
                    { name: 'Designer', value: designerPing, inline: true },
                    { name: 'Rating', value: rating.toString(), inline: true },
                    { name: 'Product', value: product, inline: true },
                    { name: 'Notes', value: notes, inline: true },
                )
                .setThumbnail(interaction.user.displayAvatarURL())
                .setFooter(interaction.guild.name, interaction.guild.iconURL()) // Updated to use an object
                .setTimestamp();

            const embed2 = new EmbedBuilder()
                .setColor('#313338')
                .setDescription(`Your review was successfully sent in ${interaction.channel.name}`)
                .setFooter(interaction.guild.name, interaction.guild.iconURL()) // Updated to use an object
                .setTimestamp();

                const reviewChannelId = '1226545547356274688'; // Replace with your desired channel ID

            const reviewChannel = interaction.client.channels.cache.get(reviewChannelId);

            await reviewChannel.send({ content: `${customerMessage}`, embeds: [embed1] });
            await reviewChannel.send({ embeds: [embed2] });

            await reviewChannel.send({ content: `${customerMessage}`, embeds: [embed] });
        }
    },
};
