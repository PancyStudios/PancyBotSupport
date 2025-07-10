import { CommandInteractionOptionResolver, GuildMember, ChatInputCommandInteraction } from "discord.js";
import { client } from '../..'; // Asumo que así exportas tu instancia de ClientExtend
import { Event } from "../../structure/Event";
import { ExtendedInteraction } from "../../Types/CommandSlash";
import { logger } from "../../handlers/logger/Console"; // Importa tu logger

export default new Event("interactionCreate", async (interaction: ChatInputCommandInteraction) => {
    // Asegurarse de que es un comando de chat
    if (!interaction.isChatInputCommand()) return;

    // --- CONSTRUCCIÓN DE LA CLAVE DEL COMANDO ---
    const commandName = interaction.commandName;
    const subCommandGroup = interaction.options.getSubcommandGroup(false);
    const subCommand = interaction.options.getSubcommand(false);

    // Construye la clave para buscar en la colección de comandos,
    // siguiendo la misma lógica que en Client.ts
    const commandKey = [commandName, subCommandGroup, subCommand].filter(Boolean).join('.');

    const command = client.commands.get(commandKey);


    if (!command) {
        logger.warn(`No se encontró el comando para la clave: "${commandKey}"`);
        return interaction.reply({ content: "Ocurrió un error, este comando parece no existir.", ephemeral: true });
    }

    try {
        // --- VALIDACIONES PRE-EJECUCIÓN ---

        // Verificación de permisos del usuario
        if (command.userPermissions) {
            const memberPermissions = interaction.member.permissions;
            if (typeof memberPermissions === 'string' || !memberPermissions.has(command.userPermissions)) {
                return interaction.reply({ content: `No tienes los permisos necesarios para usar este comando. Requerido: \`${command.userPermissions.join(', ')}\``, ephemeral: true });
            }
        }

        // Verificación de permisos del bot
        if (command.botPermissions) {
            const botMember = await interaction.guild.members.fetch(client.user.id);
            if (!botMember.permissions.has(command.botPermissions)) {
                return interaction.reply({ content: `No tengo los permisos necesarios para ejecutar este comando. Requerido: \`${command.botPermissions.join(', ')}\``, ephemeral: true });
            }
        }

        if (command.inVoiceChannel && !(interaction.member as GuildMember)?.voice?.channel) {
            return interaction.reply({ content: "Debes estar en un canal de voz para usar este comando.", ephemeral: true });
        }

        // --- EJECUCIÓN DEL COMANDO ---
        // Defer reply para comandos que pueden tardar

        await command.run({
            args: interaction.options as CommandInteractionOptionResolver,
            client,
            interaction: interaction as ExtendedInteraction,
        });

    } catch (error) {
        logger.error(`Error al ejecutar el comando "${commandKey}":`, error);
        if (interaction.deferred || interaction.replied) {
            await interaction.followUp({ content: 'Ocurrió un error al ejecutar el comando.', flags: ['Ephemeral'] });
        } else {
            await interaction.reply({ content: 'Ocurrió un error al ejecutar el comando.', flags: ['Ephemeral'] });
        }
    }
});
