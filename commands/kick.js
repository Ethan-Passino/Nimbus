const { SlashCommandBuilder } = require('discord.js');
const { PermissionsBitField } = require('discord.js');
const { savePunishment } = require('../utils/punishmentUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a member from the server.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The member to kick')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for kicking the member')
                .setRequired(false)),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const member = interaction.guild.members.cache.get(target.id);

        // Kick Command: Requires "Kick Members" permission
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return interaction.reply({ content: 'You do not have the `Kick Members` permission required to use this command.', ephemeral: true });
        }

        if (!member) {
            return interaction.reply({ content: 'User is not in the server.', ephemeral: true });
        }

        if (!member.kickable) {
            return interaction.reply({ content: 'I cannot kick this member.', ephemeral: true });
        }

        try {
            await member.kick(reason);
            await interaction.reply({ content: `Kicked ${target.tag} for: ${reason}` });

            // Save punishment
            savePunishment(interaction.guild.id, target.id, 'kick', reason);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Failed to kick the member.', ephemeral: true });
        }
    },
};
