const http = require('http');
const fs = require('fs');
const path = require('path');
const URL = require('url').URL;


// Objeto para almacenar detalles de sesión del usuario
const session = {};

// Agregar usuarios de prueba
registrarUsuario({ email: 'usuarioprueba', password: 'usuarioprueba' });
registrarUsuario({ email: 'root', password: 'root' });


const server = http.createServer((req, res) => {
  // obtén la ruta del archivo solicitado
  let filePath = path.join(__dirname, req.url);
  //-- Construir un objeto URL
  let myURL = new URL(req.url, "http://" + req.headers["host"]);
  // lee el archivo y devuelve su contenido como respuesta
  if (req.method === 'POST' && req.url === '/usuarios') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const usuario = JSON.parse(body);
        if (validarUsuario(usuario)) {
          // Guardar los detalles del usuario en la sesión
          session[usuario.email] = usuario;
          // Redirigir de vuelta al archivo index.html
          redirigirPagina('/index.html', res);
        } else {
          enviarRespuestaError(res, 401, 'Usuario o contraseña incorrectos');
        }
      } catch (error) {
        console.error(error);
        enviarRespuestaError(res, 400, 'Error al registrar usuario');
      }
    });
  }

    if (filePath === path.join(__dirname, '/')) {
    filePath = path.join(__dirname, '/index.html');
    }

    fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Error 404:Archivo no encontrado\n');
    } else {
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
      res.writeHead(200, 'Content-Type' );
        console.log("Recurso recibido: " );
        console.log("200 OK");
      res.end(data);
    }
  });
});

function registrarUsuario(usuario) {
  const filePath = path.join(__dirname, 'usuarios.json');
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const usuariosJSON = JSON.parse(data);
  
    // agrega el nuevo usuario al array de usuarios
    usuariosJSON.usuarios.push(usuario);
  
    // escribe el archivo JSON actualizado de vuelta al disco
    fs.writeFileSync(filePath, JSON.stringify(usuariosJSON));
  } catch (error) {
    console.error(error);
    throw new Error('Error al registrar usuario');
  }
}

function validarUsuario(usuario) {
  const filePath = path.join(__dirname, 'usuarios.json');
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const usuariosJSON = JSON.parse(data);
    const usuarios = usuariosJSON.usuarios;
    const usuarioValido = usuarios.find(u => u.email === usuario.email && u.password === usuario.password);
    return usuarioValido !== undefined;
  } catch (error) {
    console.error(error);
    throw new Error('Error al validar usuario');
  }
}

function redirigirPagina(url, res) {
  res.writeHead(303, { 'Location': url });
  res.end();
  }
  
server.listen(9000, () => {
  console.log('Servidor corriendo en http://localhost:9000/');
});
