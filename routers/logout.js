const express = require('express');
const { sql} = require('../sql');
const { config } = require('../sql');

const routerLogout = express.Router();

routerLogout.use(express.json());



// Cerrar sesión y registrar la hora de salida

        // Registro de la hora de salida en la tabla registroEmpleado
        // Usar idEmpleado para identificar al usuario
        // Actualizar la hora de salida con la hora actual donde idEmpleado = @idEmpleado
        // UPDATE registroEmpleado SET salida = GETDATE() WHERE idEmpleado = @idEmpleado
routerLogout.post('/', async (req, res) => {
    const idEmpleado = req.body.idEmpleado;

    try {
        const pool = await sql.connect(config);
        const request = pool.request();

        request.input('idEmpleado', sql.Int, idEmpleado);
        const result = await request.execute('RegistrarHoraSalida');

         // Verificar si hubo un error durante la ejecución del procedimiento almacenado
         if (result.recordset && result.recordset[0] && result.recordset[0].Error) {
            return res.status(500).send(result.recordset[0].Error);
        }
        /*if (result.recordset.length === 0) {
            return res.status(404).send('El empleado no existe');
        }*/
        return res.status(200).send('Sesión cerrada correctamente');
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error al cerrar sesión');
    }
});






module.exports = routerLogout;// Exportar el objeto router PARA USARLO