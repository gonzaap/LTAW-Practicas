const http = require('http');
const fs = require('fs');
const path = require('path');
const URL = require('url').URL;

const server = http.createServer((req, res) => {
  // obtén la ruta del archivo solicitado
  let filePath = path.join(__dirname, req.url);
  //-- Construir un objeto URL
  let myURL = new URL(req.url, "http://" + req.headers["host"]);
  // lee el archivo y devuelve su contenido como respuesta

    if (filePath === path.join(__dirname, '/')) {
    filePath = path.join(__dirname, '/index.html');
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Archivo no encontrado\n');
      } else {
        let contentType;
        if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
          contentType = 'image/jpeg';
        } else if (filePath.endsWith('.png')) {
          contentType = 'image/png';
        } else if (filePath.endsWith('.gif')) {
          contentType = 'image/gif';
        } else {
          contentType = 'text/html';
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', contentType);
        res.end(data);
      }
    });
  });

server.listen(9000, () => {
  console.log('Servidor corriendo en http://localhost:9000/');
});
