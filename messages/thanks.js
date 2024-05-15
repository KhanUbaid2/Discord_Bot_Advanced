const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'thank',
  description: 'Thanks a user for donating to the server!',
  usage: 'thank <@user> <amount>',
  execute(message, args) {
    // Check if the user mentioned someone
    if (!message.mentions.users.size) return message.channel.send('Please mention a user to thank.');
    const user = message.mentions.users.first();

    // Extract username from mentioned user
    const username = user.username;
    // Check for amount argument
    if (args.length < 2) {
      return message.channel.send('Please provide a donation amount.');
    }

    // Extract amount argument, handle non-numeric input
    const amount = parseFloat(args[1]);
    if (isNaN(amount)) {
      return message.channel.send('Please provide a valid donation amount (numbers only).');
    }

    // Check for decimals and adjust message accordingly  
    const isDecimal = amount % 1 !== 0;
    let amountMessage = `**${amount.toFixed(2)} Robux!**`;
    if (isDecimal) {
      amountMessage = `**${amount} Robux (please note this is not a whole number)**`;
    }

    // Create the embed message
    const embed = new EmbedBuilder()
      .setColor('#085b8e')
      .setDescription(`${username} thanks for donating ${amountMessage}. You have been awarded port premium.`)
      .setImage('https://cdn.discordapp.com/attachments/1226545547356274688/1239502427481440306/D_Line.png?ex=66432817&is=6641d697&hm=bc24ba4cd1aab7ee5f452505957ca23c7144f5372283156d1780e2d7b8156bb1&');

    // Send the embed message
    message.channel.send({ embeds: [embed] });
  },
};
