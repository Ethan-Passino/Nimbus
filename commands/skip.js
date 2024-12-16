const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips the current song.'),
    async execute(interaction) {
        const guildQueue = require('./play.js').queue.get(interaction.guild.id);

        if (!guildQueue || !guildQueue.player) {
            return interaction.reply({ content: 'There is no song to skip.', ephemeral: true });
        }

        interaction.reply('Skipped the current song.');
        guildQueue.player.stop(); // Triggers the idle event to play the next song
    },
};
