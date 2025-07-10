import { Logger } from "winston";
import { WebhookClient, EmbedBuilder } from "discord.js";

export class ErrorManager {
    webhook = new WebhookClient({ url: process.env.webhook });

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

    async discordReport(priority: number, message: string) {
        const embed = new EmbedBuilder()
        .setTitle(`Mensaje de ${priority}`)
        .setDescription(message)
        .setColor(0xff0000)

        await this.webhook.send({ embeds: [embed] });
    }
}