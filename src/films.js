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
    titulo: data.title,
    idEpisodio: data.episode_id,
    rastreoApertura: data.opening_crawl,
    director: data.director,
    productor: data.producer,
    fechaLanzamiento: data.release_date,
    personajes: data.characters,
    planetas: data.planets,
    navesEspaciales: data.starships,
    vehiculos: data.vehicles,
    especies: data.species,
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

// Función para obtener un listado de Objects films
module.exports.getFilms = async (event) => {
  let responseApi = [];
  try {
    const response = await axios.get(PUBLIC_API+'films');
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
