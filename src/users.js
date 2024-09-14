"use strict";
const AWS = require("aws-sdk");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const dotenv = require("dotenv");

const dynamodb = new AWS.DynamoDB.DocumentClient();

const envPath = path.resolve(__dirname, "../.env");
dotenv.config({ path: envPath });
const USERS_TABLE = process.env.USERS_TABLE;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_TIME = process.env.JWT_TIME;

// Función constructora de respuesta
const buildResponse = (statusCode, message) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(message),
});

// Función para crear Token según Username
const createToken = (username) => {
  return jwt.sign({ username }, JWT_SECRET, { expiresIn: JWT_TIME });
};

// Función para registrar un nuevo usuario
module.exports.register = async (event) => {
  let body;
  try {
    // Intenta parsear el cuerpo del evento como JSON
    body = JSON.parse(event.body);
  } catch (error) {
    return buildResponse(400, { error: "El cuerpo debe ser un JSON válido" });
  }

  const { username, password } = body;

  // Verifica si el objeto tiene exactamente dos claves: "username" y "password"
  const validKeys = username && password && Object.keys(body).length === 2;
  if (!validKeys) {
    return buildResponse(400, {
      error: "Solo se requieren los campos username y password",
    });
  }

  // Verifica si el username y la contraseña fueron proporcionados
  if (!username || !password) {
    return buildResponse(400, { error: "Usuario y contraseña requeridos" });
  }

  // Verifica si el username ya está registrado
  const checkParams = {
    TableName: USERS_TABLE,
    Key: { username },
  };

  const existingUser = await dynamodb.get(checkParams).promise();

  if (existingUser.Item) {
    return buildResponse(400, { error: "El usuario ya está registrado" });
  }

  // Si el username no está registrado, continuar con el registro
  const hashedPassword = await bcrypt.hash(password, 10);

  const params = {
    TableName: USERS_TABLE,
    Item: {
      username,
      password: hashedPassword,
    },
  };

  // Creación del nuevo usuario en la Tabla USERS_TABLE
  try {
    await dynamodb.put(params).promise();
    return buildResponse(201, { message: "Usuario registrado exitosamente" });
  } catch (dbError) {
    return buildResponse(500, {
      error: "Error al guardar en DynamoDB",
      detalle: dbError.message,
    });
  }
};

// Función para loguear a un usuario
module.exports.login = async (event) => {
  let body;
  try {
    // Intenta parsear el cuerpo del evento como JSON
    body = JSON.parse(event.body);
  } catch (error) {
    return buildResponse(400, { error: "El cuerpo debe ser un JSON válido" });
  }

  const { username, password } = body;

  // Verifica si el objeto tiene exactamente dos claves: "username" y "password"
  const validKeys = username && password && Object.keys(body).length === 2;
  if (!validKeys) {
    return buildResponse(400, {
      error: "Solo se requieren los campos username y password",
    });
  }

  // Verifica si el username y la contraseña fueron proporcionados
  if (!username || !password) {
    return buildResponse(400, { error: "Usuario y contraseña requeridos" });
  }

  // Verifica si el username ya está registrado
  const checkParams = {
    TableName: USERS_TABLE,
    Key: { username },
  };

  const existingUser = await dynamodb.get(checkParams).promise();

  if (!existingUser.Item) {
    return buildResponse(400, { error: "Usuario no encontrado" });
  }

  // Verifica password
  const isPasswordValid = await bcrypt.compare(
    password,
    existingUser.Item.password
  );

  if (!isPasswordValid) {
    return buildResponse(400, { error: "Contraseña incorrecta" });
  }

  // Creamos JWT para el username
  const token = createToken(username);

  return buildResponse(200, { token });
};
