const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Provides a list of commands or details about a specific command.')
        .addStringOption(option =>
            option.setName('command')
                .setDescription('Get detailed info about a specific command')
                .setRequired(false)),
    async execute(interaction) {
        const commandName = interaction.options.getString('command');
        const commandsPath = path.resolve(__dirname); // Path to the commands folder
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        const commands = commandFiles.map(file => {
            const command = require(path.join(commandsPath, file));
            return {
                name: command.data.name,
                description: command.data.description,
            };
        });

        if (commandName) {
            // Show detailed help for a specific command
            const command = commands.find(cmd => cmd.name === commandName);
            if (command) {
                const embed = new EmbedBuilder()
                    .setTitle(`Help: /${command.name}`)
                    .setDescription(command.description)
                    .setColor(0x00AE86) // Choose a nice color
                    .setFooter({ text: 'Use /help to see all commands.' });

                await interaction.reply({ embeds: [embed], ephemeral: true });
            } else {
                await interaction.reply({
                    content: `Command \`${commandName}\` not found.`,
                    ephemeral: true,
                });
            }
        } else {
            // Show general help
            const embed = new EmbedBuilder()
                .setTitle('Available Commands')
                .setDescription('Here are the commands you can use:')
                .setColor(0x00AE86); // Choose a nice color

            commands.forEach(cmd => {
                embed.addFields({ name: `/${cmd.name}`, value: cmd.description, inline: false });
            });

            embed.setFooter({ text: 'Use /help command:<command_name> for detailed info.' });

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};
