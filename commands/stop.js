const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stops playback and clears the queue.'),
    async execute(interaction) {
        const guildQueue = require('./play.js').queue.get(interaction.guild.id);

        if (!guildQueue || !guildQueue.player) {
            return interaction.reply({ content: 'There is no music playing.', ephemeral: true });
        }

        guildQueue.songs = [];
        guildQueue.player.stop();
        guildQueue.connection.destroy();
        require('./play.js').queue.delete(interaction.guild.id);

        interaction.reply('Stopped playback and cleared the queue.');
    },
};
