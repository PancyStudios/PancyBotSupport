import winston from 'winston';

/**
 * Define los niveles de log y sus colores asociados.
 * Winston utiliza los niveles estándar de npm.
 */
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

// Añade los colores a winston para que los reconozca.
winston.addColors(logLevels.colors);

/**
 * Crea una instancia del logger de Winston con una configuración personalizada.
 * Este logger reemplazará a console.log para tener un sistema de logs
 * centralizado, formateado y con niveles.
 */
const logger = winston.createLogger({
    // Define el nivel mínimo de log a mostrar.
    // Por ejemplo, si se establece en 'info', solo se mostrarán los logs de 'info' y niveles superiores (menor valor numérico).
    level: process.env.enviroment === 'dev' ? 'system' : 'info',
    levels: logLevels.levels,

    // Define el formato de salida de los logs.
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Añade un timestamp
        winston.format.colorize({ all: true }), // Colorea toda la salida del log
        winston.format.printf((info) => {
            // Define la estructura del mensaje de log.
            // ej: [2024-07-09 12:30:00] [INFO]: Mensaje del log
            return `[${info.timestamp}] [${info.level.toUpperCase()}]: ${info.message}`;
        })
    ),

    // Define a dónde se enviarán los logs (transportes).
    transports: [
        // En este caso, solo los enviaremos a la consola.
        new winston.transports.Console(),
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error' // Solo guarda logs de nivel 'error' y superior
        }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ],
});

// Exporta el logger para que pueda ser utilizado en cualquier parte de la aplicación.
export { logger };