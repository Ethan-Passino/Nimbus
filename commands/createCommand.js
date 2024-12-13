const { SlashCommandBuilder, REST, Routes } = require('discord.js');
const { ensureGuildCommands, saveCustomCommands, loadCustomCommands } = require('../utils/commandUtils');
const { clientId, token } = require('../config.json'); // Add your bot's clientId and token

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createcommand')
        .setDescription('Create a custom slash command for this guild.')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name of the new command.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('output')
                .setDescription('The output of the new command.')
                .setRequired(true)),
    async execute(interaction) {
        const { guild, options } = interaction;

        // Ensure the command is executed in a guild
        if (!guild) {
            return interaction.reply({
                content: 'This command can only be used in a server.',
                ephemeral: true,
            });
        }

        const name = options.getString('name');
        const output = options.getString('output');

        // Ensure the guild's commands are initialized
        const guildCommands = ensureGuildCommands(guild.id);

        // Check if the command already exists
        if (guildCommands[name]) {
            return interaction.reply({
                content: `A command with the name **${name}** already exists in this guild.`,
                ephemeral: true,
            });
        }

        // Add the new command
        guildCommands[name] = output;

        // Save updated commands
        const customCommands = loadCustomCommands();
        customCommands.guilds[guild.id] = guildCommands;
        saveCustomCommands(customCommands);

        // Register the new command with Discord
        const rest = new REST({ version: '10' }).setToken(token);
        try {
            await rest.put(
                Routes.applicationGuildCommands(clientId, guild.id),
                {
                    body: [
                        new SlashCommandBuilder()
                            .setName(name)
                            .setDescription(`Custom command: ${name}`)
                            .toJSON(),
                    ],
                }
            );
            await interaction.reply(`Custom command **/${name}** created and registered successfully!`);
        } catch (error) {
            console.error(`Failed to register command: ${error}`);
            await interaction.reply({
                content: `Failed to register custom command **/${name}**.`,
                ephemeral: true,
            });
        }
    },
};
