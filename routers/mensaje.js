const express = require('express');
const multer = require('multer');
const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

app.post('/publicar', upload.single('archivo'), (req, res) => {
  const autor = req.body.autor;
  const mensaje = req.body.mensaje;
  const archivo = req.file;

  // Guardar esta información en la base de datos o donde prefieras

  // Manejo de la respuesta
  res.send('Publicación creada correctamente');
});