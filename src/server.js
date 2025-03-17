const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const app = express();

// Middleware para manejar JSON y permitir CORS
app.use(express.json());
app.use(cors());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

// Conectar a la base de datos
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error("❌ Error al conectar a la base de datos:", err.message);
  } else {
    console.log("✅ Conectado a la base de datos SQLite.");
  }
});

// Crear las tablas en la base de datos si no existen
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS eventos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      id_usuario INTEGER NOT NULL,
      nombre TEXT NOT NULL,
      fecha TEXT NOT NULL,
      FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
    )
  `);
});

// Ruta para obtener usuarios
app.get("/api/usuarios", (req, res) => {
  db.all("SELECT * FROM usuarios", [], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(rows);
    }
  });
});

// Ruta para añadir un usuario
app.post("/api/usuarios", (req, res) => {
  const { nombre, email } = req.body;
  db.run(
    `INSERT INTO usuarios (nombre, email) VALUES (?, ?)`,
    [nombre, email],
    function (err) {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.status(201).json({ id: this.lastID, nombre, email });
      }
    }
  );
});

// Ruta para obtener eventos
app.get("/api/eventos", (req, res) => {
  db.all("SELECT * FROM eventos", [], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(rows);
    }
  });
});

// Ruta para añadir un evento
app.post("/api/eventos", (req, res) => {
  const { id_usuario, nombre, fecha } = req.body;
  db.run(
    `INSERT INTO eventos (id_usuario, nombre, fecha) VALUES (?, ?, ?)`,
    [id_usuario, nombre, fecha],
    function (err) {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.status(201).json({ id: this.lastID, id_usuario, nombre, fecha });
      }
    }
  );
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});