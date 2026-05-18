import 'dotenv/config'
import express from 'express'
import routesPermisos from './backend/routes/permisos.js'
import routesUsuarios from './backend/routes/users.js'
import bodyParser from 'body-parser'
import dbClient from './backend/config/dbClient.js'

const app = express();

import swaggerUI from 'swagger-ui-express'
import swaggerDocumentation from './swagger.json' with { type: "json" };

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true }))

app.use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerDocumentation))

app.use('/permisos', routesPermisos)
app.use('/usuarios', routesUsuarios)

try {
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => console.log('Servidor activo en el puerto '+ PORT))
} catch (error) {
    console.error(error)
}

process.on('SIGINT', async () => {
    await dbClient.desconectarBD()
    process.exit(0);
})