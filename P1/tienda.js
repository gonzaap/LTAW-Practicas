const http = require('http');
const fs = require('fs');
const path = require('path');
const URL = require('url').URL;

const server = http.createServer((req, res) => {
  // obtén la ruta del archivo solicitado
  const filePath = path.join(__dirname, req.url);
  //-- Construir un objeto URL
  const myURL = new URL(req.url, "http://" + req.headers["host"]);
  // lee el archivo y devuelve su contenido como respuesta
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Error 404:Archivo no encontrado\n');
    } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.end(data);
    }
  });
});

server.listen(9000, () => {
  console.log('Servidor corriendo en http://localhost:9000/');
});
