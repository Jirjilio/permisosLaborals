import swaggerAutogen from 'swagger-autogen'

const outputFile = './swagger.json'
const endpointsFiles = ['./app.js']

const doc = {
    info: {
        title: 'API de Permisos y Usuarios',
        description: 'API para gestionar permisos y usuarios con autenticación JWT',
    },
    host: 'localhost:5100',
    schemes: ['http']
}

swaggerAutogen(outputFile, endpointsFiles, doc);