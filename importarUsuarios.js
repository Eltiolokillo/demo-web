const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

// Conectar a la base de datos
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error("❌ Error al conectar a la base de datos:", err.message);
  } else {
    console.log("✅ Conectado a la base de datos SQLite.");
  }
});

// Leer el archivo CSV de usuarios
fs.readFile('usuarios.csv', 'utf8', (err, data) => {
  if (err) {
    console.error("❌ Error al leer el archivo CSV:", err);
    return;
  }

  // Dividir el archivo CSV en filas
  const filas = data.split('\n');

  // Saltar la primera fila (cabeceras)
  for (let i = 1; i < filas.length; i++) {
    const fila = filas[i].trim();

    // Evitar líneas vacías
    if (fila) {
      // Dividir cada fila en columnas (suponiendo que el delimitador es ;)
      const columnas = fila.split(';');
      const nombre = columnas[0].trim();
      const email = columnas[1].trim();

      // Verificar si los campos no están vacíos
      if (nombre && email) {
        // Verificar si ya existe un usuario con el mismo correo electrónico
        db.get(`SELECT id FROM usuarios WHERE email = ?`, [email], (err, row) => {
          if (err) {
            console.error('❌ Error al verificar si el usuario existe:', err.message);
          } else {
            if (row) {
              console.log(`❌ Usuario con email "${email}" ya existe, se ignora.`);
            } else {
              // Insertar el nuevo usuario si no existe
              db.run(
                `INSERT INTO usuarios (nombre, email) VALUES (?, ?)`,
                [nombre, email],
                function (err) {
                  if (err) {
                    console.error('❌ Error al insertar datos:', err.message);
                  } else {
                    console.log(`✅ Usuario "${nombre}" insertado con éxito.`);
                  }
                }
              );
            }
          }
        });
      } else {
        console.log('❌ Fila ignorada debido a datos faltantes:', fila);
      }
    }
  }

  // Cerrar la conexión a la base de datos
  db.close((err) => {
    if (err) {
      console.error("❌ Error al cerrar la base de datos:", err.message);
    } else {
      console.log("🔒 Conexión cerrada.");
    }
  });

  console.log('Archivo CSV de usuarios procesado');
});
