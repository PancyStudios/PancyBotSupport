// Logger del bot
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

import winston from 'winston';

const logLevels = {
    levels: {
        critical: 0,
        error: 1,
        warn: 2,
        success: 3,
        info: 4,
        debug: 5,
        system: 6,
    },
    colors: {
        critical: 'bold red',
        error: 'red',
        warn: 'yellow',
        success: 'green',
        info: 'cyan',
        debug: 'magenta',
        system: 'blue',
    },
};

winston.addColors(logLevels.colors);

const logger = winston.createLogger({
    level: process.env.enviroment === 'dev' ? 'system' : 'info',
    levels: logLevels.levels,

    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.colorize({ all: true }),
        winston.format.printf((info) => {
            return `[${info.timestamp}] [${info.level.toUpperCase()}]: ${info.message}`;
        })
    ),

    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error'
        }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ],
});

export { logger };