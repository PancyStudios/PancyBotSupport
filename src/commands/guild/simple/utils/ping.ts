import { Command } from "../../../../structure/Command";
import ms from 'ms'

export default new Command({
    name: 'ping',
    description: 'Verifica la latencia del bot',
    category: 'util',

    run: async ({ client, interaction }) => {
        const msg = await interaction.reply({ content: 'Obteniendo el ping...' })

        const ping = interaction.createdTimestamp - msg.createdTimestamp;

        await msg.edit({
            content: `:globe_with_meridians: Mensajes: ${ms(
                ping
            )}\n:robot: Discord Api: ${ms(client.ws.ping)}`,
        })
    }
})