import { Client } from "discord.js";

export class ClientExtend extends Client {


    constructor() {
        super({
            intents: ["GuildMessages"]

        });
    }

    init() {

    }
}