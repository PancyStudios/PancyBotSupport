import { Logger } from "winston";
import { WebhookClient, EmbedBuilder } from "discord.js";

const webhook = new WebhookClient({ url: process.env.webhook });

export class ErrorManager {
    public logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
    }

    init(): void {
        process.on("uncaughtException", (error: Error) => {
            this.logger.error(error);
            this.logger.warn('Se detecto una exception no controlada');
        })
    }

    discordReport(priority: number, message: string) {
        const embed = new EmbedBuilder()
        .setTitle(`Mensaje de ${priority}`)
        .setDescription(message)
        .setColor(0xff0000)

        webhook.send({ embeds: [embed] });
    }
}