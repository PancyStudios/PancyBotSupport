import express from 'express'

export const WebManager = express()

WebManager.use(express.json());
WebManager.use(express.urlencoded({ extended: true }));

WebManager.get("/", (_, res) => {
    res.send("El bot de soporte de discord esta activo")
})

WebManager.listen(1000, () => {
    console.log("WebManager Start")
})
