const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { PermissionsBitField } = require('discord.js');
const { loadAnalytics, ensureGuildData } = require('../utils/analyticsUtils');
const { isAnalyticsEnabled } = require('../utils/analyticsConfigUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('analytics')
        .setDescription('View server analytics.'),
    async execute(interaction) {
        // Analytics Command: Requires "Administrator" permission
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You do not have the `Administrator` permission required to use this command.', ephemeral: true });
        }

        // Check if analytics is enabled for the guild
        if (!isAnalyticsEnabled(interaction.guild.id)) {
            await interaction.reply({ content: 'Analytics tracking is disabled for this server.', ephemeral: true });
            return;
        }

        ensureGuildData(interaction.guild.id);

        const analytics = loadAnalytics();
        const guildData = analytics.guilds[interaction.guild.id];

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle(`${interaction.guild.name} - Analytics`)
            .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 512 }))
            .addFields(
                { name: 'Total Messages', value: `${guildData.messages.total || 0}`, inline: true },
                { name: 'Most Active Channel', value: `<#${Object.entries(guildData.messages.byChannel || {}).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None'}>`, inline: true },
                { name: 'Member Joins', value: `${guildData.memberStats.joins || 0}`, inline: true },
                { name: 'Member Leaves', value: `${guildData.memberStats.leaves || 0}`, inline: true }
            )
            .setFooter({ text: `Requested by ${interaction.user.tag}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
