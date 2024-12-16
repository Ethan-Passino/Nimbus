const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pauses the current song.'),
    async execute(interaction) {
        const guildQueue = require('./play.js').queue.get(interaction.guild.id);

        if (!guildQueue || !guildQueue.player) {
            return interaction.reply({ content: 'There is no song playing to pause.', ephemeral: true });
        }

        guildQueue.player.pause();
        interaction.reply('Paused the current song.');
    },
};
