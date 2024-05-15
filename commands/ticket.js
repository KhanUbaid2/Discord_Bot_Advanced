const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, AttachmentBuilder, ActionRowBuilder, StringSelectMenuBuilder, ChannelType } = require('discord.js');
const ticket = require('../Schemas/ticketSchema');

module.exports = {
    category: 'tickets',
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Manage the ticket system')
        .addSubcommand(command => command.setName('send').setDescription('Send the ticket message').addStringOption(option => option.setName('name').setDescription('The name for the open select menu contents').setRequired(true)).addStringOption(option => option.setName('message').setDescription('A custom message to add to the embed').setRequired(false)))
        .addSubcommand(command => command.setName('setup').setDescription('Setup the ticket category').addChannelOption(option => option.setName('category').setDescription('The category to send tickets in').addChannelTypes(ChannelType.GuildCategory).setRequired(true)))
        .addSubcommand(command => command.setName('remove').setDescription('Disable the ticket system'))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

        async execute (interaction) {

            const { options } = interaction;
            const sub = options.getSubcommand();
            const data = await ticket.findOne({ Guild: interaction.guild.id });

            switch (sub) {
                case 'send': 
                    if (!data) return await interaction.reply({ content: `⚠️ You have to do /ticket setup before you can send a ticket message...`, ephemeral: true});

                    const name = options.getString('name');
                    var message = options.getString('message') || "🌟 Hello there! Having trouble? Looking for help?\mSupport tickets are the best way to get in contact with our staff teams.\nA Support ticket can be opened for any kind of issues.\nRemember our staff team will try their best to get your issues resolved as soon possible.\n\n\n⏰ Staff try to reply as fast as possible in each ticket, so please don't ping staff unless its urgent."

                    const select = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                        .setCustomId('ticketCreateSelect')
                        .setPlaceholder(`🎫 ${name}`)
                        .setMinValues(1)
                        .addOptions(
                            {
                                label: 'Create your ticket',
                                description: 'Click to begin the ticket creation process',
                                value: 'createTicket'
                            }
                        )
                    );

                    const attachment = new AttachmentBuilder('./assets/bot_icon.jpg');
                    const embed = new EmbedBuilder()
                    .setColor('Blurple')
                    .setTitle('Create a ticket 📋')
                    .setDescription(message + ' 🎫')
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: `attachment://bot_icon.jpg` });

                    await interaction.reply({ content: `📋 I have created your ticket message below.`, ephemeral: true });
                    await interaction.channel.send({ embeds: [embed], components: [select] });

                break;
                case 'remove':
                    if (!data) return await interaction.reply({ content: `⚠️ Looks like you don't already have a ticket system set`, ephemeral: true });
                    else {
                        await ticket.deleteOne({ Guild: interaction.guild.id });
                        await interaction.reply({ content: `📋 I have deleted your ticket category.`, ephemeral: true });
                    }
                
                break;
                case 'setup':
                    if (data) return await interaction.reply({ content: `⚠️ Looks like you already have a ticket category set to <#${data.Category}>`, ephemeral: true });
                    else {
                        const category = options.getChannel('category');

                        await ticket.create({
                            Guild: interaction.guild.id,
                            Category: category.id
                        });
                    
                        await interaction.reply({ content: `📋 I have set the category to **${this.category}**! Use /ticket send to send a ticket create message`, ephemeral: true});
                    }

            }
        }
};
