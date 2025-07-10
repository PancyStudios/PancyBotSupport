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


// 1. Creamos un formato personalizado para poner el nivel en mayúsculas
const upperCaseFormat = winston.format((info) => {
    info.level = info.level.toUpperCase();
    return info;
});

// 2. Combinamos los formatos en el orden correcto
const loggerFormat = winston.format.combine(
    // Primero, añade el timestamp al objeto 'info'
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    // Luego, transforma el nivel a mayúsculas
    upperCaseFormat(),
    // Después, aplica el color al nivel ya en mayúsculas
    winston.format.colorize(),
    // Finalmente, imprime todo con el formato deseado
    winston.format.printf((info) => {
        // Ahora info.level ya está en mayúsculas y con color
        return `[${info.timestamp}] [${info.level}]: ${info.message}`;
    })
);

const logger = winston.createLogger({
    level: process.env.enviroment === 'dev' ? 'system' : 'info',
    levels: logLevels.levels,

    format: loggerFormat,

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