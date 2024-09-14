"use strict";
const { v4: uuidv4 } = require("uuid");
const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");
const path = require("path");
const dotenv = require("dotenv");
const axios = require("axios");

const dynamodb = new AWS.DynamoDB.DocumentClient();

const envPath = path.resolve(__dirname, "../.env");
dotenv.config({ path: envPath });
const PEOPLE_TABLE = process.env.PEOPLE_TABLE;
const JWT_SECRET = process.env.JWT_SECRET;
const PUBLIC_API = process.env.PUBLIC_API;

// Función para transformar los modelos de la API de Prueba
const translateAttributes = (data) => {
  return {
    nombre: data.name,
    altura: data.height,
    peso: data.mass,
    colorCabello: data.hair_color,
    colorPiel: data.skin_color,
    colorOjos: data.eye_color,
    anioNacimiento: data.birth_year,
    genero: data.gender,
    mundoNatal: data.homeworld,
    peliculas: data.films,
    especies: data.species,
    vehiculos: data.vehicles,
    navesEspaciales: data.starships,
    creado: data.created,
    editado: data.edited,
    enlace: data.url,
  };
};

// Función para verificar si un valor es un String no Vacío
const isStringNotEmpty = (dato) => {
  return typeof dato === "string" && dato.trim().length > 0;
};

// Función para verificar si un valor es un Array
const isArray = (dato) => {
  return Array.isArray(dato);
};

// Función para validar la información del nuevo Objecto People
const validatePeopleData = (newPeople) => {
  let errorMessage = [];
  if (!isStringNotEmpty(newPeople.name)) {
    errorMessage.push(
      "El campo 'nombre' es obligatorio y debe ser un string, se encuentra vacío o no existe"
    );
  }
  if (!isArray(newPeople.films)) {
    errorMessage.push("El campo 'peliculas' debe ser un Array");
  }
  if (!isArray(newPeople.species)) {
    errorMessage.push("El campo 'especies' debe ser un Array");
  }
  if (!isArray(newPeople.vehicles)) {
    errorMessage.push("El campo 'vehiculos' debe ser un Array");
  }
  if (!isArray(newPeople.starships)) {
    errorMessage.push("El campo 'navesEspaciales' debe ser un Array");
  }

  return errorMessage;
};

// Función constructora de respuesta
const buildResponse = (statusCode, message) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(message),
});

// Función para crear nuevo Object People
module.exports.addPeople = async (event) => {
  let body;
  try {
    // Intenta parsear el cuerpo del evento como JSON
    body = JSON.parse(event.body);
  } catch (error) {
    return buildResponse(400, { error: "El cuerpo debe ser un JSON válido" });
  }

  const {
    nombre,
    altura,
    peso,
    colorCabello,
    colorPiel,
    colorOjos,
    anioNacimiento,
    genero,
    mundoNatal,
    peliculas,
    especies,
    vehiculos,
    navesEspaciales,
    token,
  } = body;

  const createdAt = new Date().toISOString();
  const newId = uuidv4();

  // Verifica si token fue proporcionado
  if (!token) {
    return buildResponse(401, { error: "Token no proporcionado" });
  }

  const newPeople = {
    id: newId,
    name: nombre ?? "",
    height: altura ?? "unknown",
    mass: peso ?? "unknown",
    hair_color: colorCabello ?? "unknown",
    skin_color: colorPiel ?? "unknown",
    eye_color: colorOjos ?? "unknown",
    birth_year: anioNacimiento ?? "unknown",
    gender: genero ?? "unknown",
    homeworld: mundoNatal ?? "unknown",
    films: peliculas ?? [],
    species: especies ?? [],
    vehicles: vehiculos ?? [],
    starships: navesEspaciales ?? [],
    created: createdAt,
    edited: createdAt,
    url: "",
  };

  // Verifica la información del nuevo People
  const arrayError = validatePeopleData(newPeople);

  try {
    // Verifica el token proporcionado, caso contrario --> Catch err
    const decoded = jwt.verify(token, JWT_SECRET);

    if (arrayError.length == 0) {
      try {
        await dynamodb
          .put({
            TableName: PEOPLE_TABLE,
            Item: newPeople,
          })
          .promise();
        return buildResponse(200, {
          message: `Persona '${newPeople.name}' creada correctamente`,
        });
      } catch (dbError) {
        return buildResponse(500, {
          error: "Error al guardar en DynamoDB",
          detalle: dbError.message,
        });
      }
    } else {
      return buildResponse(400, { error: arrayError });
    }
  } catch (err) {
    return buildResponse(401, { error: "Token inválido" });
  }
};

// Función para obtener un listado de Objects People
module.exports.getPeople = async (event) => {
  // Obtener parámetros de la URL
  const queryParams = event.queryStringParameters;

  const mode = queryParams ? queryParams.mode : null;

  // Verifica si el objeto tiene: "mode"
  let apiBool = true,
    dbBool = true;
  if (mode && mode == "ONLY-API") {
    dbBool = false;
  }
  if (mode && mode == "ONLY-DB") {
    apiBool = false;
  }

  let responseApi = [];
  try {
    const response = await axios.get(PUBLIC_API + "people");
    responseApi = response.data.results.map(translateAttributes);
  } catch (error) {
    return buildResponse(500, { error: "Error al obtener data de API Prueba" });
  }

  const paramsScan = {
    TableName: PEOPLE_TABLE,
  };

  let responseAll = [];
  try {
    const result_dynamodb = await dynamodb.scan(paramsScan).promise();

    if (result_dynamodb.Items.length > 0) {
      const result_dynamodb_data =
        result_dynamodb.Items.map(translateAttributes);
      if (dbBool) {
        responseAll = [...result_dynamodb_data];
      }
    }

    if (apiBool) {
      responseAll = [...responseAll, ...responseApi];
    }

    return buildResponse(200, {
      cantidad: responseAll.length,
      resultados: responseAll,
    });
  } catch (dbError) {
    return buildResponse(500, {
      error: "Error al obtener Data en DynamoDB",
      detalle: dbError.message,
    });
  }
};
