const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear messages from the channel.')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Number of messages to clear (max 100)')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user whose messages to clear')
                .setRequired(false)),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');
        const target = interaction.options.getUser('user');

        if (amount < 1 || amount > 100) {
            return interaction.reply({ content: 'You must specify a number between 1 and 100.', ephemeral: true });
        }

        try {
            const messages = await interaction.channel.messages.fetch({ limit: amount });
            const filteredMessages = target
                ? messages.filter(msg => msg.author.id === target.id)
                : messages;

            await interaction.channel.bulkDelete(filteredMessages, true);
            await interaction.reply({ content: `Successfully deleted ${filteredMessages.size} messages${target ? ` from ${target.tag}` : ''}.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Failed to delete messages.', ephemeral: true });
        }
    },
};
