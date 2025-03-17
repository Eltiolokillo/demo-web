const apiUrl = "http://localhost:3000/api"; // URL de tu backend

// Obtener usuarios
function obtenerUsuarios() {
  fetch(`${apiUrl}/usuarios`)
    .then((response) => response.json())
    .then((data) => {
      const listaUsuarios = document.getElementById("usuariosLista");
      listaUsuarios.innerHTML = "";
      data.forEach((usuario) => {
        const li = document.createElement("li");
        li.textContent = `${usuario.nombre} - ${usuario.email}`;
        listaUsuarios.appendChild(li);
      });
    });
}

// Obtener eventos
function obtenerEventos() {
  fetch(`${apiUrl}/eventos`)
    .then((response) => response.json())
    .then((data) => {
      const listaEventos = document.getElementById("eventosLista");
      listaEventos.innerHTML = "";
      data.forEach((evento) => {
        const li = document.createElement("li");
        li.textContent = `${evento.nombre} - Fecha: ${evento.fecha}`;
        listaEventos.appendChild(li);
      });
    });
}

// Agregar un usuario
document.getElementById("formUsuario").addEventListener("submit", (event) => {
  event.preventDefault();
  const nombre = document.getElementById("nombre").value;
  const email = document.getElementById("email").value;
  
  fetch(`${apiUrl}/usuarios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nombre, email }),
  })
    .then((response) => response.json())
    .then(() => {
      obtenerUsuarios();
      document.getElementById("formUsuario").reset();
    });
});

// Agregar un evento
document.getElementById("formEvento").addEventListener("submit", (event) => {
  event.preventDefault();
  const id_usuario = document.getElementById("id_usuario").value;
  const nombre = document.getElementById("nombre_evento").value;
  const fecha = document.getElementById("fecha_evento").value;
  
  fetch(`${apiUrl}/eventos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id_usuario, nombre, fecha }),
  })
    .then((response) => response.json())
    .then(() => {
      obtenerEventos();
      document.getElementById("formEvento").reset();
    });
});

// Cargar usuarios y eventos al inicio
obtenerUsuarios();
obtenerEventos();
