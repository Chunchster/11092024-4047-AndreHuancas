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
    modelo: data.model,
    fabricante: data.manufacturer,
    costoCreditos: data.cost_in_credits,
    longitud: data.length,
    velocidadAtmosfericaMaxima: data.max_atmosphering_speed,
    multitud: data.crew,
    pasajeros: data.passengers,
    capacidadCarga: data.cargo_capacity,
    consumible: data.consumables,
    clasificacionHiperimpulsor: data.hyperdrive_rating,
    MGLT: data.MGLT,
    claseNaveEspacial: data.starship_class,
    pilotos: data.pilots,
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

// Función para obtener un listado de Objects Starships
module.exports.getStarships = async (event) => {
  let responseApi = [];
  try {
    const response = await axios.get(PUBLIC_API+'starships');
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
