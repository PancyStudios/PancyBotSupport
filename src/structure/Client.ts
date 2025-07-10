// Cliente de Discord.js
// Copyright (C) 2025  PancyStudio Developers
//
// Este programa es software libre: puede redistribuirlo y/o modificarlo
// bajo los términos de la Licencia Pública General de GNU publicada por
// la Free Software Foundation, ya sea la versión 3 de la Licencia o
// (a su elección) cualquier versión posterior.
//
// Este programa se distribuye con la esperanza de que sea útil, pero SIN NINGUNA GARANTÍA;
// ni siquiera la garantía implícita de COMERCIABILIDAD o IDONEIDAD PARA UN PROPÓSITO PARTICULAR.
// Consulte la Licencia Pública General de GNU para obtener más detalles.
import {
    ApplicationCommandDataResolvable,
    Client,
    Collection,
    Partials,
    ClientEvents,
    ApplicationCommandSubCommandData,
    ApplicationCommandOptionType, ApplicationCommandSubGroupData
} from "discord.js";
import { RegisterCommandsOptions } from "../Types/Client";
import { logger } from '../handlers/logger/Console';
import { CommandType } from "../Types/CommandSlash";
import { Event } from "./Event";
import { glob } from 'glob';
import path from "path";
import ms from 'ms';

export class ClientExtend extends Client{
    slashCommands: ApplicationCommandDataResolvable[] = [];
    commands: Collection<string, CommandType> = new Collection();
    subcommands: Collection<string, string> = new Collection();
    subcommandsGroup: Collection<string, string> = new Collection();
    subcommandsCategory: Collection<string, string> = new Collection();

    constructor() {
        super({
            intents: [
                'DirectMessages',
                'GuildModeration',
                'GuildMembers',
                'GuildIntegrations',
                'GuildVoiceStates',
                'GuildPresences',
                'GuildWebhooks',
                'GuildMessageReactions',
                'GuildEmojisAndStickers',
                'MessageContent',
                'Guilds',
                'GuildMessages',
            ],
            partials: [
                Partials.Channel,
                Partials.GuildMember,
                Partials.Message,
                Partials.User,
                Partials.Reaction,
            ]
        });
    }

    async init() {
        try {
            const msInit = Date.now()
            await this.registerModules()
            await this.login(process.env.botToken)
            await this.registerCommands({ commands: this.slashCommands })
            logger.info(`El sistema se a cargado en ${ms(Date.now() - msInit)}`)
        } catch (err) {
            logger.crit(`Ocurrio un error al iniciar el sistema`)
            logger.crit(err)
        }
    }

    async importFile(filePath: string) {
        return (await import(filePath))?.default;
    }

    async registerCommands({ commands, guildId }: RegisterCommandsOptions) {
        if (guildId) {
            await this.guilds.cache.get(guildId)?.commands.set(commands);
            logger.info(`Registering commands to ${guildId}`, 'API DC');
        }
            else {
                await this.application?.commands.set(commands);
                logger.info("Registering global commands", 'API DC');
            }
        }

    async registerModules() {

        // --- REGISTRO DE COMANDOS ---
        // Se procesan todas las carpetas dentro de commands/Guilds (commands, subcommands, etc.)
        const commandDirs = await glob(`${process.cwd()}/src/commands/guild/*`);

        for (const dirPath of commandDirs) {
            const dirName = path.basename(dirPath);

            switch (dirName) {
                // Caso para comandos de nivel superior: /commands/Guilds/commands/Category/command.ts
                case 'simple': {
                    const commandFiles = await glob(`${dirPath}/*/*{.ts,.js}`);
                    for (const filePath of commandFiles) {
                        const command: CommandType = await this.importFile(filePath);
                        if (!command?.name) continue;

                        logger.debug(`${filePath}: ${command.name}`);
                        this.commands.set(command.name, command);
                        this.slashCommands.push(command);
                    }
                    break;
                }

                // Caso para subcomandos: /commands/Guilds/subcommands/groupName/subcommand.ts
                case 'subcommands': {
                    const groupDirs = await glob(`${dirPath}/*`);
                    for (const groupPath of groupDirs) {
                        const groupName = path.basename(groupPath);
                        this.subcommands.set(groupName, groupName);

                        const subCommandFiles = await glob(`${groupPath}/*{.ts,.js}`);
                        const subCommandOptions: ApplicationCommandSubCommandData[] = [];

                        for (const filePath of subCommandFiles) {
                            const command: CommandType = await this.importFile(filePath);
                            if (!command?.name) continue;

                            // El archivo del comando ya es el subcomando, solo hacemos aserción de tipo
                            subCommandOptions.push(command as unknown as ApplicationCommandSubCommandData);
                            this.commands.set(`${groupName}.${command.name}`, command);
                        }

                        if (subCommandOptions.length > 0) {
                            this.slashCommands.push({
                                name: groupName,
                                description: `Comandos del grupo ${groupName}`,
                                options: subCommandOptions,
                            });
                        }
                    }
                    break;
                }

                // Caso para grupos de subcomandos: /commands/Guilds/subcommandsgroup/groupName/subGroupName/command.ts
                case 'subcommandsgroup': {
                    const groupDirs = await glob(`${dirPath}/*`);
                    for (const groupPath of groupDirs) {
                        const groupName = path.basename(groupPath);
                        this.subcommandsGroup.set(groupName, groupName);

                        const subGroupDirs = await glob(`${groupPath}/*`);
                        const subGroupOptions: ApplicationCommandSubGroupData[] = [];

                        for (const subGroupPath of subGroupDirs) {
                            const subGroupName = path.basename(subGroupPath);
                            this.subcommandsCategory.set(subGroupName, subGroupName);

                            const commandFiles = await glob(`${subGroupPath}/*{.ts,.js}`);
                            const commandOptions: ApplicationCommandSubCommandData[] = [];

                            for (const filePath of commandFiles) {
                                const command: CommandType = await this.importFile(filePath);
                                if (!command?.name) continue;

                                commandOptions.push(command as unknown as ApplicationCommandSubCommandData);
                                this.commands.set(`${groupName}.${subGroupName}.${command.name}`, command);
                            }

                            if (commandOptions.length > 0) {
                                subGroupOptions.push({
                                    name: subGroupName,
                                    description: `Comandos de ${subGroupName}`,
                                    type: ApplicationCommandOptionType.SubcommandGroup,
                                    options: commandOptions,
                                });
                            }
                        }

                        if (subGroupOptions.length > 0) {
                            this.slashCommands.push({
                                name: groupName,
                                description: `Comandos del grupo ${groupName}`,
                                options: subGroupOptions,
                            });
                        }
                    }
                    break;
                }
            }
        }

        // Event
        const eventFiles = await glob(
            `${process.cwd()}/src/events/*/*{.ts,.js}`
        );
        for (const filePath of eventFiles) {
            try {
                const event: Event<keyof ClientEvents> = await this.importFile(
                    filePath
                );

                if(!event.event) continue;
                logger.info(`Evento ${filePath} cargado ${event.event}`);
                this.on(event.event, event.run)
            } catch (err) {
                logger.error(`El archivo ${filePath} no se pudo cargar evento`)
            }
        }
    }
}