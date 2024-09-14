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
    periodoRotacion: data.rotation_period,
    periodoOrbital: data.orbital_period,
    diametro: data.diameter,
    clima: data.climate,
    gravedad: data.gravity,
    terreno: data.terrain,
    aguaSuperficial: data.surface_water,
    poblacion: data.population,
    residentes: data.residents,
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

// Función para obtener un listado de Objects Planets
module.exports.getPlanets = async (event) => {
  let responseApi = [];
  try {
    const response = await axios.get(PUBLIC_API+'planets');
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
