require('./utils/ProcessHandlers.js')();

const PREFIX = '-';

const emojiID1 = '1234809241244663869';
const emojiID2 = '1234809275579367464';

const { Client, GatewayIntentBits, Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionsBitField, ButtonStyle } = require(`discord.js`);
const fs = require('fs');
const { Partials } = require('discord.js');
const { ActivityType } = require('discord-api-types/v9');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.AutoModerationConfiguration,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.AutoModerationExecution,
    ],

    partials: [
        Partials.GuildMember,
        Partials.Channel,
        Partials.GuildScheduledEvent,
        Partials.Message,
        Partials.Reaction,
        Partials.ThreadMember,
        Partials.User
    ]
});


client.config = require('./config.json');
client.logs = require('./utils/Logs.js');
client.cooldowns = new Map();

require('./utils/ComponentLoader.js')(client);
require('./utils/EventLoader.js')(client);
require('./utils/RegisterCommands.js')(client);

client.logs.info(`Logging in...`);
client.login(client.config.TOKEN);
client.on('ready', function () {
    client.logs.success(`Logged in as ${client.user.tag}!`);
});


client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'verify_button') {
        const member = interaction.member;
        const guild = interaction.guild;

        const memberRole = guild.roles.cache.find(role => role.id === '1233106927924543620');
        const unverifiedRole = guild.roles.cache.find(role => role.id === '1233106991011074160');

        // Check if the user has the member role
        const hasMemberRole = member.roles.cache.has(memberRole.id);

        try {
            if (hasMemberRole) {
                // Remove member role and add unverified role
                await member.roles.remove(memberRole);
                await member.roles.add(unverifiedRole);
                const buttonMessage = await interaction.channel.messages.fetch(interaction.message.id);
                await buttonMessage.reply('You have been unverified!');
            } else {
                // Remove unverified role and add member role
                await member.roles.remove(unverifiedRole);
                await member.roles.add(memberRole);
                const buttonMessage = await interaction.channel.messages.fetch(interaction.message.id);
                await buttonMessage.reply('You have been verified!');
            }
        } catch (error) {
            console.error(`Failed to toggle roles for ${member.user.tag}: ${error}`);
        }
    }
});



client.on('guildMemberAdd', async member => {
    const guild = member.guild;
    const unverifiedRole = guild.roles.cache.find(role => role.id === '1233106991011074160');
    if (unverifiedRole) {
        try {
            await member.roles.add(unverifiedRole);
        } catch (error) {
            console.error(`Failed to add unverified role to ${member.user.tag}: ${error}`);
        }
    } else {
        console.error("Unverified role not found.");
    }
});


const embedWithImage = new EmbedBuilder()
    .setImage('https://media.discordapp.net/attachments/1145706779049738290/1215796693224788018/D_ServBan2.png?ex=66317868&is=663026e8&hm=32f8d1d9a5856b309c59902479a621cc75b9705563776faf840fd8dbc86912e3&format=webp&quality=lossless&')
    .setColor('#313338');

const embedWithText = new EmbedBuilder()
    .setDescription(`<:Nr1:${emojiID1}> This server requires you to verify yourself to get access to other channels, you can simply verify by clicking on the verify button. \n \n<:Nr2:${emojiID2}> Another verification method is; /verify. This command is hosted by Bloxlink.`)
    .setColor('#313338')
    .setImage('https://media.discordapp.net/attachments/1145706779049738290/1215796692415418528/D_Line.png?ex=66317867&is=663026e7&hm=8854c5828dea51aa1df47d095ddbcbc649a3e1954aad16ca02c8f89d99990cc0&format=webp&quality=lossless&');

const row = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('verify_button')
            .setLabel('Click me To Verify')
            .setStyle('2')
    );

client.on('ready', (c) => {
    console.log(`✅ ${c.user.tag} is online.`);

    const channel = client.channels.cache.get('1235280439866818570');
    channel.send({ embeds: [embedWithImage, embedWithText], components: [row] });

    client.config = require("./config.json");

    client.user.setActivity({
        name: '/help',
        type: ActivityType.Watching,
    });
});

client.on('message', msg => {
    if (msg.content === '!hello') {
      msg.reply('Hei! Jeg er en Discord-bot.');
    };
    });

const prefix = "-";
client.on('guildMemberAdd', async member => {
    const guild = member.guild;
    const channel = guild.channels.cache.get('1226545547356274688'); // Replace 'YOUR_CHANNEL_ID' with the actual channel ID where you want to send the welcome message

    // Define the current member count
    const memberCount = guild.memberCount;

    // Define the welcome message with emoji, ping, and member count
    const welcomeMessage = ` Welcome <@${member.user.id}> to Design Port™ – Use your binoculars and explore our other channels! We now have ${memberCount} members.`;

    // Send the welcome message
    channel.send(welcomeMessage);
});

function CheckAccess(requiredRoles, userIDs, member, user) {
    if (member && requiredRoles) {
        const hasRole = requiredRoles.some(roleID => member._roles.includes(roleID));
        if (!hasRole && !member.permissions.has('Administrator')) {
            throw 'Missing roles';
        }
    }

    if (userIDs) {
        if (!userIDs.includes(user.id)) {//} && !member.permissions.has('Administrator')) {
            throw 'Missing user whitelist';
        }
    }
}

function CheckPermissions(permissionsArray, member) {
    if (!Array.isArray(permissionsArray)) return;

    const missingPermissions = [];
    if (member && permissionsArray.length > 0) {
        for (const permission of permissionsArray) {
            if (member.permissions.has(Permissions[permission])) continue;
            missingPermissions.push(permission);
        }
    }

    if (missingPermissions.length > 0) throw missingPermissions.join(', ');
}

function CheckCooldown(user, command, cooldown) {
    if (client.cooldowns.has(user.id)) {
        const expiration = client.cooldowns.get(user.id);
        if (expiration > Date.now()) {
            const remaining = (expiration - Date.now()) / 1000;
            throw `Please wait ${remaining.toFixed(1)} more seconds before reusing the \`${command}\` command!`;
        }
    }
    if (!cooldown) return;
    client.cooldowns.set(user.id, Date.now() + cooldown * 1000);
}


async function InteractionHandler(interaction, type) {

    const args = interaction.customId?.split("_") ?? [];
    const name = args.shift();

    interaction.deferUpdate ??= interaction.deferReply;

    const component = client[type].get(name ?? interaction.commandName);
    if (!component) {
        client.logs.error(`${type} not found: ${interaction.customId}`);
        return;
    }

    try {
        CheckAccess(component.roles, component.users, interaction.member, interaction.user);
    } catch (reason) {
        await interaction.reply({
            content: "You don't have permission to use this command!",
            ephemeral: true
        }).catch(() => { });
        client.logs.error(`Blocked user from ${type}: ${reason}`);
        return;
    }

    try {
        CheckCooldown(interaction.user, component.customID ?? interaction.commandName, component.cooldown);
    } catch (reason) {
        await interaction.reply({
            content: reason,
            ephemeral: true
        }).catch(() => { });
        client.logs.error(`Blocked user from ${type}: On cooldown`);
        return;
    }

    try {
        CheckPermissions(component.userPerms, interaction.member);
    } catch (permissions) {
        await interaction.reply({
            content: `You are missing the following permissions: \`${permissions}\``,
            ephemeral: true
        }).catch(() => { });
        client.logs.error(`Blocked user from ${type}: Missing permissions`);
        return;
    }

    try {
        const botMember = interaction.guild.members.cache.get(client.user.id) ?? await interaction.guild.members.fetch(client.user.id);
        CheckPermissions(component.clientPerms, botMember);
    } catch (permissions) {
        await interaction.reply({
            content: `I am missing the following permissions: \`${permissions}\``,
            ephemeral: true
        }).catch(() => { });
        client.logs.error(`Could not execute ${type}: Missing bot permissions`);
        return;
    }

    try {
        if (interaction.isAutocomplete()) {
            await component.autocomplete(interaction, client, type === 'commands' ? undefined : args);
        } else {
            await component.execute(interaction, client, type === 'commands' ? undefined : args);
        }
    } catch (error) {
        client.logs.error(error.stack);
        await interaction.deferReply({ ephemeral: true }).catch(() => { });
        await interaction.editReply({
            content: `There was an error while executing this command!\n\`\`\`${error}\`\`\``,
            embeds: [],
            components: [],
            files: [],
            ephemeral: true
        }).catch(() => { });
    }
}

client.on('interactionCreate', async function (interaction) {
    if (!interaction.isCommand() && !interaction.isAutocomplete()) return;

    const subcommand = interaction.options._subcommand ?? "";
    const subcommandGroup = interaction.options._subcommandGroup ?? "";
    const commandArgs = interaction.options._hoistedOptions ?? [];
    const args = `${subcommandGroup} ${subcommand} ${commandArgs.map(arg => arg.value).join(" ")}`.trim();
    client.logs.info(`${interaction.user.tag} (${interaction.user.id}) > /${interaction.commandName} ${args}`);

    await InteractionHandler(interaction, 'commands');
});


client.on('interactionCreate', async function (interaction) {
    if (!interaction.isButton()) return;
    client.logs.info(`${interaction.user.tag} (${interaction.user.id}) > [${interaction.customId}]`);
    await InteractionHandler(interaction, 'buttons');
});


client.on('interactionCreate', async function (interaction) {
    if (!interaction.isStringSelectMenu()) return;
    client.logs.info(`${interaction.user.tag} (${interaction.user.id}) > <${interaction.customId}>`);
    await InteractionHandler(interaction, 'menus');
});


client.on('interactionCreate', async function (interaction) {
    if (!interaction.isModalSubmit()) return;
    client.logs.info(`${interaction.user.tag} (${interaction.user.id}) > {${interaction.customId}}`);
    await InteractionHandler(interaction, 'modals');
});

client.on('messageCreate', async function (message) {
    if (message.author.bot) return;
    if (!message.content?.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).split(/\s+/);
    const name = args.shift().toLowerCase();

    const command = client.messages.get(name);
    if (!command) {
        client.logs.error(`Command not found: ${name}`);
        return await message.reply(`There was an error while executing this command!\n\`\`\`Command not found\`\`\``).catch(() => { });
    }

    try {
        CheckAccess(command.roles, command.users, message.member, message.author);
    } catch (reason) {
        await message.reply("You don't have permission to use this command!").catch(() => { });
        client.logs.error(`Blocked user from message: ${reason}`);
        return;
    }

    try {
        CheckCooldown(message.author, name, command.cooldown);
    } catch (reason) {
        await message.reply(reason).catch(() => { });
        client.logs.error(`Blocked user from message: On cooldown`);
        return;
    }

    try {
        CheckPermissions(command.userPerms, message.member);
    } catch (permissions) {
        await message.reply(`You are missing the following permissions: \`${permissions}\``).catch(() => { });
        client.logs.error(`Blocked user from message: Missing permissions`);
        return;
    }

    try {
        CheckPermissions(command.clientPerms, message.guild.me);
    } catch (permissions) {
        await message.reply(`I am missing the following permissions: \`${permissions}\``).catch(() => { });
        client.logs.error(`Could not execute message: Missing bot permissions`);
        return;
    }

    

    try {
        await command.execute(message, client, args);
    } catch (error) {
        client.logs.error(error.stack);
        await message.reply(`There was an error while executing this command!\n\`\`\`${error}\`\`\``).catch(() => { });
    } finally {
        client.cooldowns.set(message.author.id, Date.now() + command.cooldown * 1000);
        setTimeout(client.cooldowns.delete.bind(client.cooldowns, message.author.id), command.cooldown * 1000);
    }
});

client.login(process.env.TOKEN);