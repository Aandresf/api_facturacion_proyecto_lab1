//import swaggerAutogen from 'swagger-autogen';
const swaggerAutogen = require('swagger-autogen'); // Importar swagger-autogen

const outputFile = './swagger.json'; // Archivo de salida
const endpointsFiles = [
    './index.js', // Archivo principal de la API

]; // Archivos de entrada

const doc = {
    info: {
        title: 'API de Facturación', // Título de la API
        description: 'Documentación de la API de Facturación.'
    },
    host: 'localhost:4040', // URL base de la API
    schemes: ['http'], // Protocolo (http o https)
    tags: [
        {
            name: 'Productos',
            description: 'Operaciones relacionadas con los productos'
        },
        {
            name: 'Ordenes',
            description: 'Operaciones relacionadas con las ordenes'
        },
        {
            name: 'Facturas',
            description: 'Operaciones relacionadas con las facturas'
        },
        {
            name: 'Cliente',
            description: 'Operaciones relacionadas con los clientes'
        },
        {
            name: 'Categorias',
            description: 'Operaciones relacionadas con las categorias',
        },
        {
            name: 'Ajuste Precio',
            description: 'Operaciones relacionadas con el ajuste de precio'
        }
    ]
};

swaggerAutogen()(outputFile, endpointsFiles, doc).then(() => {
    console.log('Documentación generada en swagger.json');
})