const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');
const { saveGuildSettings, getGuildSettings } = require('../utils/colorsUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setassigncolorrole')
        .setDescription('Set the required role for using the assigncolor command')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role required to use assigncolor (leave blank for everyone)')
                .setRequired(false)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const role = interaction.options.getRole('role');
        const guildId = interaction.guild.id;
        const settings = getGuildSettings(guildId);

        settings.assignColorRole = role ? role.id : 'everyone';
        saveGuildSettings(guildId, settings);

        return interaction.reply(`The required role for the assigncolor command has been set to ${
            role ? role.name : 'everyone'
        }.`);
    },
};
