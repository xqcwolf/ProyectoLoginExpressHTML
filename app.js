const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'xexpress'
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Ruta para el inicio de sesión
app.get('/Login', (req, res) => {
  const user = req.query.user;
  const pass = req.query.pass;

  console.log("Datos recibidos en Login:", { user, pass });

  if (!user || !pass) {
    return res.status(400).send('Usuario y contraseña son requeridos');
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error al obtener conexión:', err);
      res.status(500).send('Error al conectar a la base de datos');
      return;
    }

    connection.query('SELECT * FROM `usuarios` WHERE `usuario` = ? AND `clave` = ?', [user, pass], (err, results) => {
      connection.release();
      if (err) {
        console.error('Error al consultar en la base de datos:', err);
        res.status(500).send('Error al consultar usuario en la base de datos');
        return;
      }
      if (results.length === 0) {
        res.status(401).send('Usuario o contraseña incorrectos');
        return;
      }
      res.send('Inicio de sesión exitoso');
    });
  });
});

// Ruta para el registro de usuarios
app.get('/Registro', (req, res) => {
  const user = req.query.user;
  const pass = req.query.pass;

  console.log("Datos recibidos en Registro:", { user, pass });

  if (!user || !pass) {
    return res.status(400).send('Usuario y contraseña son requeridos');
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error al obtener conexión:', err);
      res.status(500).send('Error al conectar a la base de datos');
      return;
    }

    connection.query('INSERT INTO `usuarios` (`usuario`, `clave`) VALUES (?, ?)', [user, pass], (err, results) => {
      connection.release();
      if (err) {
        console.error('Error al insertar en la base de datos:', err);
        res.status(500).send('Error al insertar usuario en la base de datos');
      } else {
        res.send('Usuario registrado correctamente');
      }
    });
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
