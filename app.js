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

const allowedOrigins = new Set([
    'http://localhost:4200',
    'http://127.0.0.1:4200',
]);

app.use((req, res, next) => {
    const origin = req.headers.origin;

    if (origin && allowedOrigins.has(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    next();
});

app.use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerDocumentation))

app.use('/permisos', routesPermisos)
app.use('/usuarios', routesUsuarios)

export default app;

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