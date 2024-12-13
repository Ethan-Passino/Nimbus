const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getUserHistory } = require('../utils/punishmentUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('history')
        .setDescription('Retrieve a user\'s punishment history.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user whose history to retrieve')
                .setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser('user');
        const history = getUserHistory(interaction.guild.id, target.id);

        if (history.length === 0) {
            return interaction.reply({ content: `${target.tag} has no recorded punishments.`, ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle(`Punishment History for ${target.tag}`)
            .setThumbnail(target.displayAvatarURL({ dynamic: true }))
            .setDescription(
                history
                    .map(
                        (entry, index) =>
                            `**${index + 1}. ${entry.type.toUpperCase()}**\nReason: ${entry.reason}\nDuration: ${entry.duration || 'N/A'}\nDate: <t:${Math.floor(new Date(entry.timestamp).getTime() / 1000)}:F>\n`
                    )
                    .join('\n')
            )
            .setFooter({ text: `Requested by ${interaction.user.tag}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
