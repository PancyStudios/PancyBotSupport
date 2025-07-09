import express from 'express'
import { logger } from "../logger/Console"

export const WebManager = express()

WebManager.use(express.json());
WebManager.use(express.urlencoded({ extended: true }));

WebManager.get("/", (_, res) => {
    res.send("El bot de soporte de discord esta activo")
})

WebManager.listen(process.env.PORT, () => {
    logger.info("Liste de soporte de discord esta activo")
})
