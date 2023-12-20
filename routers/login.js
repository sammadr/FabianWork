const express = require('express');
const { sql} = require('../sql');
const { config } = require('../sql');
const routerLogin = express.Router();


routerLogin.use(express.json());


// Verificar las credenciales del usuario y obtener su ID
routerLogin.post('/', async (req, res) => {
    const { correo, clave } = req.body;

    try {
        const pool = await sql.connect(config);
        const request = pool.request();

        request.input('correo', sql.VarChar(30), correo);
        request.input('clave', sql.VarChar(20), clave);

        const result = await request.query(`SELECT idEmpleado FROM empleado WHERE correo = @correo AND clave = @clave`);

        if (result.recordset.length > 0) {
            const idEmpleado = result.recordset[0].idEmpleado;

         // Llamar al procedimiento almacenado RegistrarHoraEntrada
         const entradaRequest = pool.request();
         entradaRequest.input('idEmpleado', sql.Int, idEmpleado);
         await entradaRequest.execute('RegistrarHoraEntrada');
            return res.status(200).json({ idEmpleado });
        } else {
            return res.status(401).send('Credenciales inválidas');
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error en el inicio de sesión');
    }
});



module.exports = routerLogin;// Exportar el objeto router

