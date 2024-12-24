const { SlashCommandBuilder } = require('discord.js');
const { PermissionsBitField } = require('discord.js');
const { savePunishment } = require('../utils/punishmentUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Timeout a member.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The member to timeout')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('duration')
                .setDescription('Duration in minutes')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the timeout')
                .setRequired(false)),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const duration = interaction.options.getInteger('duration');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const member = interaction.guild.members.cache.get(target.id);

        // Mute Command: Requires "Moderate Members" permission
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({ content: 'You do not have the `Moderate Members` permission required to use this command.', ephemeral: true });
        }

        if (!member) {
            return interaction.reply({ content: 'User is not in the server.', ephemeral: true });
        }

        if (!member.moderatable) {
            return interaction.reply({ content: 'I cannot timeout this member.', ephemeral: true });
        }

        try {
            const timeoutDuration = duration * 60 * 1000; // Convert minutes to milliseconds
            await member.timeout(timeoutDuration, reason);
            await interaction.reply({ content: `${target.tag} has been timed out for ${duration} minutes. Reason: ${reason}` });

            // Save the punishment
            savePunishment(interaction.guild.id, target.id, 'mute', reason, duration);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Failed to timeout the member.', ephemeral: true });
        }
    },
};
