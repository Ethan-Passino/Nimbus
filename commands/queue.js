const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Displays the song queue.'),
    async execute(interaction) {
        const guildQueue = require('./play.js').queue.get(interaction.guild.id);

        if (!guildQueue || !guildQueue.songs.length) {
            return interaction.reply({ content: 'The queue is empty.', ephemeral: true });
        }

        const queueEmbed = new EmbedBuilder()
            .setTitle('Song Queue')
            .setColor(0x00AE86)
            .setDescription(
                guildQueue.songs.map((song, index) => `${index + 1}. [${song.title}](${song.url})`).join('\n')
            );

        interaction.reply({ embeds: [queueEmbed] });
    },
};
