const http = require('http');
const fs = require('fs');
const path = require('path');
const URL = require('url').URL;

// Objeto para almacenar detalles de sesión del usuario
const session = {};

// Leer archivo de usuarios
const filePath = path.join(__dirname, 'tienda.json');
let tiendaJSON = fs.readFileSync(filePath);
let usuarios = JSON.parse(tiendaJSON).usuarios;

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const usuario = url.searchParams.get('usuario');
    const contrasena = url.searchParams.get('contrasena');
    if (usuario && contrasena) {
      const datosUsuario = JSON.parse(body);
      if (datosUsuario.usuario && datosUsuario.contrasena) {
        if (validarUsuario(datosUsuario.usuario, datosUsuario.contrasena)) {
          req.session = {
            usuario: datosUsuario.usuario,
            loggedIn: true
          };
          redirigirPagina('/index.html', res);
        } else {
          enviarRespuestaError(res, 401, 'Usuario o contraseña incorrectos');
          console.error(error);
        }
      } else {
        enviarRespuestaError(res, 400, 'Faltan campos en el formulario');
        console.error(error);
      }
    } else {
      let filePath = '.' + url.pathname;
      if (filePath === './') {
        filePath = './index.html';
      }
      const extname = String(path.extname(filePath)).toLowerCase();
      let contentType = 'text/html';
      switch (extname) {
        case '.js':
          contentType = 'text/javascript';
          break;
        case '.css':
          contentType = 'text/css';
          break;
        case '.json':
          contentType = 'application/json';
          break;
        case '.png':
          contentType = 'image/png';
          break;
        case '.jpg':
          contentType = 'image/jpg';
          break;
        case '.gif':
          contentType = 'image/gif';
          break;
      }
      fs.readFile(filePath, (error, content) => {
        if (error) {
          enviarRespuestaError(res, 500, 'Error en el servidor');
          console.error(error);
        } else {
          // Verificar si el usuario tiene una sesión iniciada
          const sesionUsuario = req.session && req.session.loggedIn && req.session.usuario;
          // Reemplazar la cadena "<usuario>" en el contenido con el nombre de usuario si hay una sesión iniciada
          if (sesionUsuario) {
            content = content.toString().replace('<usuario>', req.session.usuario);
          }
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(content, 'utf-8');
        }
      });
    }
  } else if (req.method === 'POST') {
    let body = '';
    let filePath = '.' + req.url.split('?')[0];
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const datosUsuario = JSON.parse(body);
      if (datosUsuario.usuario && datosUsuario.contrasena) {
        if (validarUsuario(datosUsuario.usuario, datosUsuario.contrasena)) {
          req.session = {
            usuario: datosUsuario.usuario,
            loggedIn: true
          };

          redirigirPagina('/index.html', res);
        } else {
          enviarRespuestaError(res, 401, 'Usuario o contraseña incorrectos');
          console.error(error);
        }
      } else {
        enviarRespuestaError(res, 400, 'Faltan campos en el formulario');
        console.error(error);
      }
    });
  } else {
    enviarRespuestaError(res, 405, 'Método no permitido');
    console.error(error);
  }
});

function enviarRespuestaError(res, statusCode, mensaje) {
  res.writeHead(statusCode, { 'Content-Type': 'text/plain' });
  res.end(mensaje);
}

function validarUsuario(usuario, contrasena) {
  const usuarioValido = usuarios.find(u => u.usuario === usuario && u.contrasena === contrasena);
  return usuarioValido !== undefined;
}

function redirigirPagina(url, res) {
  res.writeHead(303, { 'Location': url });
  res.end();
}

server.listen(8090, () => {
  console.log('Servidor corriendo en http://localhost:8090/');
});
