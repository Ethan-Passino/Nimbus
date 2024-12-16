const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resumes the paused song.'),
    async execute(interaction) {
        const guildQueue = require('./play.js').queue.get(interaction.guild.id);

        if (!guildQueue || !guildQueue.player) {
            return interaction.reply({ content: 'There is no song to resume.', ephemeral: true });
        }

        guildQueue.player.unpause();
        interaction.reply('Resumed the current song.');
    },
};
