const express = require('express');
const cors = require("cors");
//Para poder crear las peticiones http
const app = express();
//Para que no haya bloque de peticion
app.use(cors());

//Las creaciones de rutas las hacemos para tener un mejor orden de nuestro codigo
const routerEmpleado = require('./routers/empleados.js'); 
app.use('/api/empleado',routerEmpleado);

const routerLogin = require('./routers/login.js'); 
app.use('/api/login',routerLogin); 

const routerLogout = require('./routers/logout.js'); 
app.use('/api/logout',routerLogout); 


//Este es el numero de puerto en el que esta nuestro servidor
const PUERTO = process.env.PORT || 3000;

//Encendemos el servidor en el puerto correspondiente
app.listen(PUERTO, () => {
    console.log("Servidor encendido en el", PUERTO);
});
