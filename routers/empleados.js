const express = require('express');
const { sql} = require('../sql');
const { config } = require('../sql');
const routerEmpleado= express.Router();

routerEmpleado.use(express.json());


//Ruta para obtener lista de todos los empleado
routerEmpleado.get('/', (req, res) => {
    sql.connect(config, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error en la conexión a la base de datos');
        }

        //Recibira los valores y ejecutara el sql
        const request = new sql.Request();
        request.query(
            `SELECT 
                e.idEmpleado,
                e.nombre AS NombreEmpleado,
                e.apellido AS ApellidoEmpleado,
                e.telefono AS TelefonoEmpleado,
                e.correo AS CorreoEmpleado,
                e.sexo AS SexoEmpleado,
                e.clave AS ClaveEmpleado,
                e.estatus AS EstatusEmpleado,
                p.nombrePuesto AS PuestoEmpleado,
                CONVERT(VARCHAR, r.entrada, 20) AS HoraEntrada,
                r.diaEntrada AS DiaEntrada, 
                CONVERT(VARCHAR, r.salida, 20) AS HoraSalida, 
                r.diaSalida AS DiaSalida,
                CONVERT(VARCHAR, r.tiempoTotal, 20) AS TiempoTotal 
            FROM empleado e
            LEFT JOIN Puestos p ON e.idPuesto = p.idPuesto
            LEFT JOIN registroEmpleado r ON e.idEmpleado = r.idEmpleado where e.estatus = 1`
            , (err, records) => {
                if (err) {
                    console.log(err);
                    sql.close();
                    return res.status(500).send('Error al ejecutar la consulta');
                }
            
                // Cerrar la conexión a la base de datos y enviar los registros formateados como JSON
                sql.close();
                res.json(records.recordset);
            }
        );
    });
});



// Ruta para obtener un empleado por id
routerEmpleado.get('/:id', async (req, res) => {
    try {
        const idEmpleado = req.params.id;

        const pool = await sql.connect(config);
        const request = pool.request();

        request.input('idEmpleado', sql.Int, idEmpleado);

        const result = await request.execute('BuscarEmpleadoPorID');

        sql.close();

        // Verificar si no hay resultados en la respuesta de la base de datos o si el estatus es desactivado (estatus = 0)
        if (result.recordset.length === 0 || result.recordset[0].estatus === 0) {

            //Si no hay resultado en la base de datos muestra este mensaje
            return res.status(404).send('El Empleado no existe en la base de datos o está desactivado.');
        }
        //Envia resultado de la base de datos en JSON
        res.json(result.recordset);
        //Si hay un error loe envia por aqui y cierra base de datos
    } catch (error) {
        console.error(error);
        sql.close();
        res.status(500).send('Error al obtener el Registro de Empleado por ID');
    }
});


// Ruta para crear un empleado o un admin - si el correo pertenece a admin se creara un nuevo administrador

// si el correo es perteneciente a un empleado se creara un nuevo empleado
//Si entra uno de esos dos correo que no pertenecen al sistema este lo va a rechazar porque no puede crearlo si no es con uno de esos dos
routerEmpleado.post('/', (req, res) => {
    //Estos son los datos que espera recibir el post
    const {nombre, apellido, telefono,correo,sexo,clave,estatus,idPuesto } = req.body;
   //colocamos en dominioCorreo el valor del correo que entro del post o la peticion
   //pero con split lo que hacemos es dividir la cadena de texto que contiene el correo usando @ como sepacion
    const dominioCorreo = correo.split('@')[1];
   
      //preparando conexion a base de datos
       sql.connect(config, (err) => {
        //si hay un error al conectarse a la base de datos mostrara un mensaje
        if (err) {
            console.log(err);
            return res.status(500).send('Error en la conexión a la base de datos');
        }
      

      // Verifica el dominio del correo electrónico
    if (dominioCorreo === 'example.com') {
        //aca validamos que no esten vacios los datos
        if (!nombre || !apellido || !telefono || !correo || !sexo || !clave || !estatus || !idPuesto  ) {
            //si estan vacios enviara este mensaje al servidor con su codigo correspondido
            return res.status(400).send('Por favor, proporcione todos los datos requeridos.');
        }
        //Si los datos estan bien seguira el curso del sistema

        //Recibira los valores y los llevara a la base de datos y al final ejectura el procedimiento
        const request = new sql.Request();
     
        request.input('nombre', sql.VarChar(30), nombre);
        request.input('apellido', sql.VarChar(30), apellido);
        request.input('telefono', sql.VarChar(15), telefono);
        request.input('correo', sql.VarChar(30), correo);
        request.input('clave', sql.VarChar(20), clave);
        request.input('sexo', sql.VarChar(1), sexo);
        request.input('estatus', sql.Int, estatus);
        request.input('idPuesto', sql.Int, idPuesto)

        //Si todos los datos estan bien ejecurara el procedimiento y creara un nuevo empleado
        request.execute('CrearNuevoEmpleado', (err, result) => {
            //Si algo sale mal en la ejecucion del procedimiento mostrara un error
            if (err) {
                console.log(err);
                sql.close();
                return res.status(500).send('Error al ejecutar el procedimiento almacenado');
            }
            //Si todo esta bien cerrara la conexion a la base de datos y mostrara el codigo con su mensaje de exito
            sql.close();
            res.status(201).send('Empleado agregado correctamente');
        });       
    }

    //Si el dominio del correo no es de empleadpo vendra aqui y ya sabe los datoa que tiene que recibir
    else if (dominioCorreo === 'admin.com') {
        const {nombre, apellido, telefono, correo, sexo, clave } = req.body;

         //Lo mismo, verificar que los datos no esten vacios
    if (!nombre || !apellido || !telefono || !correo || !sexo || !clave ) {
        return res.status(400).send('Por favor, proporcione todos los datos requeridos DEL ADMIN.');
    }
       //si todo los dattos estan bien tomara los datos y ejecutara el procedimiento de la base de datos

        const request = new sql.Request();

        request.input('nombre', sql.VarChar(20), nombre);
        request.input('apellido', sql.VarChar(20), apellido);
        request.input('telefono', sql.VarChar(12), telefono);
        request.input('correo', sql.VarChar(20), correo);
        request.input('sexo', sql.VarChar(1), sexo);
        request.input('clave', sql.VarChar(10), clave);
        
        //Ejecucion de procedimiento alamcenado
        request.execute('CrearNuevoAdministrador', (err, result) => {
            if (err) {
                console.log(err);
                sql.close();
                return res.status(500).send('Error al ejecutar el procedimiento almacenado');
            }
            sql.close();
            res.status(201).send('Administrador agregado correctamente');
        });

    } 
    //Si no es ninguno de esos dos correo no le permitira crear un empleado o un administrador
    else {
        // No corresponde a ningún dominio permitido
        return res.status(403).send('No se puede crear un administrador o un Empleado con este correo electrónico');
    }

    });
});


// Ruta para eliminar un empleado por ID
routerEmpleado.delete('/:id', async (req, res) => {

    try {
        //Dato a recibir por parametro
        const idEmpleado = req.params.id;
        //Conexion a la base de datos
        const pool = await sql.connect(config);
        const request = pool.request();

        //Tomara el dato recibido por el parametro
        request.input('idEmpleado', sql.Int, idEmpleado);
          //Si todo esta bien va a...
        // Ejecutar el procedimiento almacenado para eliminar un empleado por su ID
        const result = await request.execute('EliminarEmpleadoPorID');
          
        sql.close();
        
        // Verificar si hay empleado con ese id
        if (result.rowsAffected[0] === 0) {
            return res.status(404).send('No se encontró ningún empleado con ese ID');
        }
         //Se elemino el registro correctamente
        res.status(200).send('Empleado eliminado correctamente');
    } catch (error) {
        console.error(error);
        sql.close();
        res.status(500).send('Error al eliminar el empleado por ID');
    }
});

// Ruta para actualizar un empleado por ID
routerEmpleado.put('/:id', (req, res) => {
      //Dato a recibir por parametro
      const idEmpleado = req.params.id;

    // Datos que se reciben para actualizar info
    const { nombre, apellido, telefono, correo, sexo, clave, estatus, idPuesto } = req.body;

    // Validación de datos no esten vacíos
    if (!nombre || !apellido || !telefono || !correo || !sexo || !clave || !estatus || !idPuesto) {
        return res.status(400).send('Por favor, proporcione todos los datos requeridos.');
    }

    // Conexión a la base de datos
    sql.connect(config, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error en la conexión a la base de datos');
        }

        // Creación de la solicitud SQL
        const request = new sql.Request();

        // Definición de los parámetros para la actualización
        request.input('idEmpleado', sql.Int, idEmpleado);
        request.input('nombre', sql.VarChar(30), nombre);
        request.input('apellido', sql.VarChar(30), apellido);
        request.input('telefono', sql.VarChar(15), telefono);
        request.input('correo', sql.VarChar(30), correo);
        request.input('clave', sql.VarChar(20), clave);
        request.input('sexo', sql.VarChar(1), sexo);
        request.input('estatus', sql.Int, estatus);
        request.input('idPuesto', sql.Int, idPuesto);

        // Ejecución del procedimiento almacenado para actualizar
        request.execute('ActualizarEmpleado', (err, result) => {
            if (err) {
                console.log(err);
                sql.close();
                return res.status(500).send('Error al ejecutar el procedimiento almacenado para actualizar');
            }

            sql.close();
            res.status(200).send('Empleado actualizado correctamente');
        });
    });
});


module.exports = routerEmpleado;// Exportar el objeto router
