const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ordercall',
    description: 'Call for orders',
    async execute(message, args) {

        const roleID = "1239499759291465739";

        // Create the first embed message with an image
        const imageEmbed = new EmbedBuilder()
            .setColor('#085b8e')
            .setImage('https://cdn.discordapp.com/attachments/1226545547356274688/1239501528029466635/D_ServBan2.png?ex=66432741&is=6641d5c1&hm=7b800064390803f39c424ef5c1cbbc95f22fc943d3ad2fa54fdcd9a892c2fbf9&');
        
        // Create the second embed message with title and description
        const textEmbed = new EmbedBuilder()
            .setColor('#085b8e')
            .setTitle('🔔 Unclaimed Order!')
            .setDescription('Luckily for you, this order is unclaimed. A designer is urgently needed to begin producing the desired material for the customer!')
            .setImage('https://media.discordapp.net/attachments/1226545547356274688/1239502427481440306/D_Line.png?ex=66432817&is=6641d697&hm=bc24ba4cd1aab7ee5f452505957ca23c7144f5372283156d1780e2d7b8156bb1&=&format=webp&quality=lossless');

        // Send the combined embeds in one message
        const sentMessage = await message.channel.send({ content: `<@&${roleID}>`, embeds: [imageEmbed, textEmbed] });

        // Delete the command message
        message.delete();
    },
};
