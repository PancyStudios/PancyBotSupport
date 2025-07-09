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

import { Client } from "discord.js";
import { logger } from '../handlers/logger/Console'

export class ClientExtend extends Client {
    client : ClientExtend
    constructor() {
        super({
            intents: ["GuildMessages"]

        });
        this.init()
    }

    init() {
        logger.info('Iniciando cliente')
        this.login(process.env.botToken)
            .catch((err) => { logger.error(err) })
    }
}