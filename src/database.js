const sqlite3 = require("sqlite3").verbose();

// Conectar a la base de datos (se creará un archivo "database.db")
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error("❌ Error al conectar a la base de datos:", err.message);
  } else {
    console.log("✅ Conectado a la base de datos SQLite.");
  }
});

// Crear una tabla llamada "usuarios"
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error("❌ Error al crear la tabla:", err.message);
    } else {
      console.log("✅ Tabla 'usuarios' creada o ya existente.");
    }
  });
});

// Cerrar la conexión
db.close((err) => {
  if (err) {
    console.error("❌ Error al cerrar la base de datos:", err.message);
  } else {
    console.log("🔒 Conexión cerrada.");
  }
});