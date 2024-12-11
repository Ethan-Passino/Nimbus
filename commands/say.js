const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('The bot will say what you input!')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message for the bot to say')
                .setRequired(true)),
    async execute(interaction) {
        // Get the user's input
        const userMessage = interaction.options.getString('message');

        // Respond with the user's message
        await interaction.reply({
            content: userMessage,
            ephemeral: false, // Set to true if you don't want the bot's message to be public
        });
    },
};
