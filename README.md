<!--
title: 'RETO TÉCNICO BACKEND NODEJS UTILIZANDO SERVERLESS'
description: 'Esta plantilla demuestra cómo crear una API HTTP simple con Node.js ejecutándose en AWS Lambda y API Gateway usando Serverless Framework.'
layout: Doc
framework: v4
platform: AWS
language: nodeJS
authorLink: 'https://github.com/Chunchster'
authorName: 'Andre Huancas - Chunchster'
-->

# RETO TÉCNICO BACKEND NODEJS UTILIZANDO SERVERLESS - Andre Huancas

Esta documentación guía paso a paso cómo desplegar una API HTTP con Node.js ejecutándose en AWS Lambda y API Gateway usando Serverless Framework.

**Stack Tecnológico**
* Serverless Framework
* AWS (DynamoDB, Lambda)
* Node
* JWT
* API REST (StarWars API)

## Uso

### Instalación

Clonar el repositorio
  
```
git clone <repository-url>
cd serverless-indra
```

Instala las dependencias

```
npm install
```

### Despliegue

Asegúrate de que tus credenciales de AWS estén configuradas.
```
aws configure
```

Asegúrate de tener el archivo `.env` con las siguientes variables:
```
JWT_SECRET=jwt-secret
JWT_TIME=1h
PEOPLE_TABLE=nombre-tabla-people
USERS_TABLE=nombre-tabla-users
PEOPLE_SECRET=nombre-recurso-ARN
USERS_SECRET=nombre-recurso-ARN
PUBLIC_API=https://swapi.py4e.com/api/
```

Para implementar la aplicación, debe ejecutar el siguiente comando:

```
serverless deploy
```

Después de ejecutar la implementación, debería ver un resultado similar al siguiente:

```
Deploying "serverless-indra" to stage "dev" (us-east-2)

✔ Service deployed to stack serverless-indra-dev (41s)

endpoints:
  POST - https://xxxxxxxxxx.execute-api.us-east-2.amazonaws.com/users/register
  POST - https://xxxxxxxxxx.execute-api.us-east-2.amazonaws.com/users/login
  POST - https://xxxxxxxxxx.execute-api.us-east-2.amazonaws.com/people/add
  GET - https://xxxxxxxxxx.execute-api.us-east-2.amazonaws.com/people
  GET - https://xxxxxxxxxx.execute-api.us-east-2.amazonaws.com/films
  GET - https://xxxxxxxxxx.execute-api.us-east-2.amazonaws.com/planets
  GET - https://xxxxxxxxxx.execute-api.us-east-2.amazonaws.com/species
  GET - https://xxxxxxxxxx.execute-api.us-east-2.amazonaws.com/starships
  GET - https://xxxxxxxxxx.execute-api.us-east-2.amazonaws.com/vehicles
functions:
  createUsers: serverless-indra-dev-createUsers (19 MB)
  createToken: serverless-indra-dev-createToken (19 MB)
  createPeople: serverless-indra-dev-createPeople (19 MB)
  listPeople: serverless-indra-dev-listPeople (19 MB)
  listFilms: serverless-indra-dev-listFilms (19 MB)
  listPlanets: serverless-indra-dev-listPlanets (19 MB)
  listSpecies: serverless-indra-dev-listSpecies (19 MB)
  listStarships: serverless-indra-dev-listStarships (19 MB)
  listVehicles: serverless-indra-dev-listVehicles (19 MB)
```

### Invocación

Después de una implementación exitosa, puede llamar a la aplicación creada a través de HTTP:

#### *Usuarios*

`post` **/users/register**

```
curl -X POST https://xxxxxxxxxx.execute-api.us-east-2.amazonaws.com/users/register
```
Crea un nuevo usuario en la Base de Datos. Enviar un payload en formato JSON con los siguientes campos.

```json
{
  "username": "nombre-usuario",
  "password": "password-usuario"
}
```

Lo que debería dar como resultado una respuesta similar a la siguiente:

```json
{ "message": "Usuario registrado exitosamente" }
```

`post` **/users/login**

```
curl -X POST https://xxxxxxxxxx.execute-api.us-east-2.amazonaws.com/users/login
```
Permite acceder al sistema y retorna un token el cual permite crear nuevos items Personas en la Base de Datos. Enviar un payload en formato JSON con los siguientes campos.

_Nota_*:* *El tiempo de vigencia del token es establecido en el archivo `.env` (JWT_TIME)*

```json
{
  "username": "nombre-usuario",
  "password": "password-usuario"
}
```

Lo que debería dar como resultado una respuesta similar a la siguiente:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
}
```

#### *Personas*

`post` **/people/add**

```
curl -X POST https://xxxxxxxxxx.execute-api.us-east-2.amazonaws.com/people/add
```
Permite crear nuevos items Personas en la Base de Datos. Enviar un payload en formato JSON con los siguientes campos.

_Nota_*:* *Los campos 'nombre' y 'token' son obligatorios.*

```json
{
  "nombre": "nombre-persona",
  "altura": "170",
  "peso": "72",
  "colorCabello": "Black",
  "colorPiel": "Hispanic",
  "colorOjos": "Black",
  "anioNacimiento": "2002",
  "genero": "Men",
  "mundoNatal": "Earth",
  "peliculas": ["Toy Story","Cars"],
  "especies": ["Human"],
  "vehiculos": ["Snowspeeder"],
  "navesEspaciales": ["X-wing"],
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
}
```

Lo que debería dar como resultado una respuesta similar a la siguiente:

```json
{
  "message": "Persona 'nombre-persona' creada correctamente"
}
```

`get` **/people**

```
curl -X GET https://xxxxxxxxxx.execute-api.us-east-2.amazonaws.com/people
```
Permite obtener un listado de items Personas de la Base de Datos y obtenidos de StarWars API.

Cuenta con dos versiones, el cual permite obtener solo items Personas de la Base de Datos o solo items Personas de StarwarsApi

Items Personas de la Base de Datos
```
curl -X GET https://xxxxxxxxxx.execute-api.us-east-2.amazonaws.com/people?mode=ONLY-DB
```

Items Personas de StarWars API
```
curl -X GET https://xxxxxxxxxx.execute-api.us-east-2.amazonaws.com/people?mode=ONLY-API
```

Lo que debería dar como resultado una respuesta similar a la siguiente:

```json
{
  "cantidad": 11,
  "resultados": [
    {
        "nombre": "nombre-persona",
        "altura": "170",
        "peso": "72",
        "colorCabello": "Black",
        "colorPiel": "Hispanic",
        "colorOjos": "Black",
        "anioNacimiento": "2002",
        "genero": "Men",
        "mundoNatal": "Earth",
        "peliculas": ["Toy Story","Cars"],
        "especies": ["Human"],
        "vehiculos": ["Snowspeeder"],
        "navesEspaciales": ["X-wing"],
        "creado": "2024-09-13T22:26:37.219Z",
        "editado": "2024-09-13T22:26:37.219Z",
        "enlace": "https://swapi.py4e.com/api/people/1/"
    }, ...
  ]
}  
```

#### *Películas*

`get` **/films**

```
curl -X GET https://xxxxxxxxxx.execute-api.us-east-2.amazonaws.com/films
```
Permite obtener un listado de items Películas obtenidos de StarWars API.

Lo que debería dar como resultado una respuesta similar a la siguiente:

```json
{
  "cantidad": 7,
  "resultados": [
    {
      "titulo": "A New Hope",
      "idEpisodio": 4,
      "rastreoApertura": "It is a period of civil war.\r\nRebel spaceships, striking\r\nfrom a hidden base, have won\r\ntheir first victory against\r\nthe evil Galactic Empire.\r\n\r\nDuring the battle, Rebel\r\n....",
      "director": "George Lucas",
      "productor": "Gary Kurtz, Rick McCallum",
      "fechaLanzamiento": "1977-05-25",
      "personajes": [
          "https://swapi.py4e.com/api/people/1/",
      ],
      "planetas": [
          "https://swapi.py4e.com/api/planets/1/",
          ...
      ],
      "navesEspaciales": [
          "https://swapi.py4e.com/api/starships/2/",
          ...
      ],
      "vehiculos": [
          "https://swapi.py4e.com/api/vehicles/4/",
          ...
      ],
      "especies": [
          "https://swapi.py4e.com/api/species/1/",
          ..
      ],
      "creado": "2014-12-10T14:23:31.880000Z",
      "editado": "2014-12-20T19:49:45.256000Z",
      "enlace": "https://swapi.py4e.com/api/films/1/"
    }, ...
  ]
}  
```

#### *Planetas*

`get` **/planets**

```
curl -X GET https://xxxxxxxxxx.execute-api.us-east-2.amazonaws.com/planets
```
Permite obtener un listado de items Planetas obtenidos de StarWars API.

Lo que debería dar como resultado una respuesta similar a la siguiente:

```json
{
  "cantidad": 10,
  "resultados": [
    {
      "nombre": "Tatooine",
      "periodoRotacion": "23",
      "periodoOrbital": "304",
      "diametro": "10465",
      "clima": "arid",
      "gravedad": "1 standard",
      "terreno": "desert",
      "aguaSuperficial": "1",
      "poblacion": "200000",
      "residentes": [
          "https://swapi.py4e.com/api/people/1/",
          ...
      ],
      "peliculas": [
          "https://swapi.py4e.com/api/films/1/",
          ...
      ],
      "creado": "2014-12-09T13:50:49.641000Z",
      "editado": "2014-12-20T20:58:18.411000Z",
      "enlace": "https://swapi.py4e.com/api/planets/1/"
    }, ...
  ]
}  
```

#### *Especies*

`get` **/species**

```
curl -X GET https://xxxxxxxxxx.execute-api.us-east-2.amazonaws.com/species
```
Permite obtener un listado de items Especies obtenidos de StarWars API.

Lo que debería dar como resultado una respuesta similar a la siguiente:

```json
{
  "cantidad": 10,
  "resultados": [
    {
      "nombre": "Human",
      "clasificacion": "mammal",
      "designacion": "sentient",
      "alturaMedia": "180",
      "coloresPiel": "caucasian, black, asian, hispanic",
      "coloresCabello": "blonde, brown, black, red",
      "coloresOjos": "brown, blue, green, hazel, grey, amber",
      "esperanzaVidaMedia": "120",
      "mundoNatal": "https://swapi.py4e.com/api/planets/9/",
      "idioma": "Galactic Basic",
      "personas": [
          "https://swapi.py4e.com/api/people/1/",
          ...
      ],
      "peliculas": [
          "https://swapi.py4e.com/api/films/1/",
          ...
      ],
      "creado": "2014-12-10T13:52:11.567000Z",
      "editado": "2014-12-20T21:36:42.136000Z",
      "enlace": "https://swapi.py4e.com/api/species/1/"
    }, ...
  ]
}  
```

#### *Naves Espaciales*

`get` **/starships**

```
curl -X GET https://xxxxxxxxxx.execute-api.us-east-2.amazonaws.com/starships
```
Permite obtener un listado de items Naves Espaciales obtenidos de StarWars API.

Lo que debería dar como resultado una respuesta similar a la siguiente:

```json
{
  "cantidad": 10,
  "resultados": [
    {
      "nombre": "CR90 corvette",
      "modelo": "CR90 corvette",
      "fabricante": "Corellian Engineering Corporation",
      "costoCreditos": "3500000",
      "longitud": "150",
      "velocidadAtmosfericaMaxima": "950",
      "multitud": "30-165",
      "pasajeros": "600",
      "capacidadCarga": "3000000",
      "consumible": "1 year",
      "clasificacionHiperimpulsor": "2.0",
      "MGLT": "60",
      "claseNaveEspacial": "corvette",
      "pilotos": [],
      "peliculas": [
          "https://swapi.py4e.com/api/films/1/",
          ...
      ],
      "creado": "2014-12-10T14:20:33.369000Z",
      "editado": "2014-12-20T21:23:49.867000Z",
      "enlace": "https://swapi.py4e.com/api/starships/2/"
    }, ...
  ]
}  
```

#### *Vehículos*

`get` **/vehicles**

```
curl -X GET https://xxxxxxxxxx.execute-api.us-east-2.amazonaws.com/vehicles
```
Permite obtener un listado de items Vehículos obtenidos de StarWars API.

Lo que debería dar como resultado una respuesta similar a la siguiente:

```json
{
  "cantidad": 10,
  "resultados": [
    {
      "nombre": "Sand Crawler",
      "modelo": "Digger Crawler",
      "fabricante": "Corellia Mining Corporation",
      "costoCreditos": "150000",
      "longitud": "36.8 ",
      "velocidadAtmosfericaMaxima": "30",
      "multitud": "46",
      "pasajeros": "30",
      "capacidadCarga": "50000",
      "consumible": "2 months",
      "claseVehiculo": "wheeled",
      "pilotos": [],
      "peliculas": [
          "https://swapi.py4e.com/api/films/1/",
          ...
      ],
      "creado": "2014-12-10T15:36:25.724000Z",
      "editado": "2014-12-20T21:30:21.661000Z",
      "enlace": "https://swapi.py4e.com/api/vehicles/4/"
    }, ...
  ]
}  
```

### Desarrollo local

La forma más sencilla de desarrollar y probar su función es utilizar el comando `dev`:

```
serverless dev
```