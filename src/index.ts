// Nucleo del bot
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

import { ErrorManager } from "./handlers/logger/Errors";
import { ClientExtend } from "./structure/Client";
import {logger } from "./handlers/logger/Console";
import { WebManager } from "./handlers/web";
import { config } from "dotenv";
config();

logger.info(process.env.webhook)

export const client = new ClientExtend();
export const server = WebManager;
export const error = new ErrorManager(logger);

setTimeout(async () => {
    await client.init();
}, 200)

