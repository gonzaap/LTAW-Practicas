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
  if (req.method === 'GET') {
    let filePath = '.' + req.url;
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
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  } else if (req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const usuario = JSON.parse(body);
      if (usuario.username && usuario.password) {
        if (usuarios[usuario.username] === usuario.password) {
          req.session = {
            username: usuario.username,
            loggedIn: true
          };
          redirigirPagina('/', res);
        } else {
          enviarRespuestaError(res, 401, 'Usuario o contraseña incorrectos');
        }
      } else {
        enviarRespuestaError(res, 400, 'Faltan campos en el formulario');
      }
    });
  } else {
    enviarRespuestaError(res, 405, 'Método no permitido');
  }
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
