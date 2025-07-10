import { logger } from '../../handlers/logger/Console';
import { Event } from "../../structure/Event";
import { client } from "../..";

export default new Event('ready', () => {
    logger.info(`El cliente esta listo ${client.user.tag}`)
})