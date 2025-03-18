const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();

// Middleware para manejar JSON y CORS
app.use(express.json());
app.use(cors());

// 📌 Conectar a la base de datos SQLite
const db = new sqlite3.Database(path.join(__dirname, "../database.db"), (err) => {
  if (err) {
    console.error("❌ Error al conectar a la base de datos:", err.message);
  } else {
    console.log("✅ Conectado a la base de datos SQLite.");
  }
});

// 📌 Crear las tablas si no existen
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

// 📌 Rutas de la API

// Obtener todos los usuarios
app.get("/api/usuarios", (req, res) => {
  db.all("SELECT * FROM usuarios", [], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(rows);
    }
  });
});

// Agregar un nuevo usuario
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

// Eliminar un usuario
app.delete("/api/usuarios/:id", (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM usuarios WHERE id = ?`, [id], function (err) {
    if (err) {
      res.status(500).send(err.message);
    } else if (this.changes === 0) {
      res.status(404).send("Usuario no encontrado");
    } else {
      res.status(200).send("Usuario eliminado");
    }
  });
});

// Obtener todos los eventos
app.get("/api/eventos", (req, res) => {
  db.all("SELECT * FROM eventos", [], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(rows);
    }
  });
});

// Agregar un nuevo evento
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

// Eliminar un evento
app.delete("/api/eventos/:id", (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM eventos WHERE id = ?`, [id], function (err) {
    if (err) {
      res.status(500).send(err.message);
    } else if (this.changes === 0) {
      res.status(404).send("Evento no encontrado");
    } else {
      res.status(200).send("Evento eliminado");
    }
  });
});

// 📌 Servir archivos estáticos correctamente
app.use(express.static(path.join(__dirname, "../public")));

// 📌 Servir el archivo index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

// 📌 Capturar rutas no manejadas y devolver 404
app.use((req, res) => {
  res.status(404).send("Página no encontrada");
});

// 📌 Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
