const { SlashCommandBuilder } = require('discord.js'); // Import SlashCommandBuilder
const { PermissionsBitField } = require('discord.js');
const { loadCustomCommands, saveCustomCommands } = require('../utils/commandUtils'); // Import utility functions

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deletecommand')
        .setDescription('Delete a custom command for this guild.')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name of the command to delete.')
                .setRequired(true)),
    async execute(interaction) {
        const { guild, options } = interaction;

        // DeleteCommand Command: Requires "Manage Guild" permission
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            return interaction.reply({ content: 'You do not have the `Manage Server` permission required to use this command.', ephemeral: true });
        }

        const name = options.getString('name');

        // Load existing commands
        const customCommands = loadCustomCommands();

        // Check if the command exists for this guild
        if (!customCommands.guilds[guild.id] || !customCommands.guilds[guild.id][name]) {
            return interaction.reply({
                content: `No command found with the name **${name}** in this guild.`,
                ephemeral: true,
            });
        }

        // Delete the command
        delete customCommands.guilds[guild.id][name];
        saveCustomCommands(customCommands);

        await interaction.reply(`Custom command **/${name}** deleted successfully from this guild!`);
    },
};
