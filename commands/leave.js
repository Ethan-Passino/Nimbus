const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Disconnect the bot from the voice channel.'),
    async execute(interaction) {
        const connection = getVoiceConnection(interaction.guild.id);

        if (!connection) {
            return interaction.reply({ content: 'I am not in a voice channel.', ephemeral: true });
        }

        connection.destroy();
        interaction.reply({ content: 'Disconnected from the voice channel.' });
    },
};
