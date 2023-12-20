const sql = require('mssql/msnodesqlv8');

//Confirguramos el entorno para la conexion de la base de datos
const config ={
///
 
}



// Luego, puedes utilizar sql.connect para conectarte a la base de datos y ejecutar consultas
sql.connect(config, (err) => {
    if (err) {
      console.error('Error de conexión:', err);
      return;
    }
  
    // Aquí puedes realizar consultas utilizando sql.query, por ejemplo:
    const request = new sql.Request();
    //Comprobamos que la conexion se hizo con exito
    request.query('SELECT 1', (err, result) => {
      if (err) {
        console.error('Error en la consulta:', err);
        sql.close();
        return;
      }
  
      console.log('Resultados:', result);
      sql.close(); // cerrar la conexión después de usarla
    });
  });

module.exports = {sql , config};// Exportamos el objeto 'sql' si necesitamos usarlo directamente en otros archivos
