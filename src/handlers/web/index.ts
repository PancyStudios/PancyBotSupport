// Servidor web para comprobar su funcionamiento
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

import express from 'express'
import { logger } from "../logger/Console"

export const WebManager = express()

WebManager.use(express.json());
WebManager.use(express.urlencoded({ extended: true }));

WebManager.get("/", (_, res) => {
    res.send("El bot de soporte de discord esta activo")
})

WebManager.listen(process.env.PORT, () => {
    logger.info("El bot de soporte esta activo")
})
