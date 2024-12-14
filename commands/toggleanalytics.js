const { SlashCommandBuilder } = require('discord.js');
const { loadAnalyticsConfig, saveAnalyticsConfig, ensureGuildConfig } = require('../utils/analyticsConfigUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('toggleanalytics')
        .setDescription('Enable or disable analytics tracking for this server.')
        .addBooleanOption(option =>
            option.setName('enabled')
                .setDescription('Enable or disable analytics')
                .setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({ content: 'You need to be an administrator to use this command.', ephemeral: true });
        }

        const guildId = interaction.guild.id;
        const enabled = interaction.options.getBoolean('enabled');

        ensureGuildConfig(guildId);

        const config = loadAnalyticsConfig();
        config.guilds[guildId].analyticsEnabled = enabled;
        saveAnalyticsConfig(config);

        await interaction.reply({
            content: `Analytics tracking has been ${enabled ? 'enabled' : 'disabled'} for this server.`,
            ephemeral: true,
        });
    },
};
