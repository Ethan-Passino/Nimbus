const { SlashCommandBuilder } = require('discord.js');
const { PermissionsBitField } = require('discord.js');
const { savePunishment } = require('../utils/punishmentUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a member.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The member to warn')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the warning')
                .setRequired(false)),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        // Warn Command: Requires "Moderate Members" permission
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({ content: 'You do not have the `Moderate Members` permission required to use this command.', ephemeral: true });
        }

        // Save the warning
        savePunishment(interaction.guild.id, target.id, 'warn', reason);

        // Notify in the channel
        await interaction.reply({ content: `${target.tag} has been warned. Reason: ${reason}` });
    },
};
