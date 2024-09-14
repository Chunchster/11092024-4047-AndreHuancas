"use strict";
const AWS = require("aws-sdk");
const path = require("path");
const dotenv = require("dotenv");
const axios = require('axios');

const dynamodb = new AWS.DynamoDB.DocumentClient();

const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

const PUBLIC_API = process.env.PUBLIC_API;

// Función para transformar los modelos de la API de Prueba
const translateAttributes = (data) => {
  return {
    nombre: data.name,
    clasificacion: data.classification,
    designacion: data.designation,
    alturaMedia: data.average_height,
    coloresPiel: data.skin_colors,
    coloresCabello: data.hair_colors,
    coloresOjos: data.eye_colors,
    esperanzaVidaMedia: data.average_lifespan,
    mundoNatal: data.homeworld,
    idioma: data.language,
    personas: data.people,
    peliculas: data.films,
    creado: data.created,
    editado: data.edited,
    enlace: data.url
  };
};

// Función constructora de respuesta
const buildResponse = (statusCode, message) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(message)
});

// Función para obtener un listado de Objects Species
module.exports.getSpecies = async (event) => {
  let responseApi = [];
  try {
    const response = await axios.get(PUBLIC_API+'species');
    responseApi = response.data.results.map(translateAttributes);

    return buildResponse(
      200,
      { 
        cantidad: responseApi.length,
        resultados: responseApi
      }
    );

  } catch (error) {
    return buildResponse(500, { error: 'Error al obtener data de API Prueba' });
  }
};
