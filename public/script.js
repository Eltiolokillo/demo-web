document.addEventListener('DOMContentLoaded', function() {
    // Función para cargar los usuarios desde la API
    function cargarUsuarios() {
      fetch('http://localhost:3000/api/usuarios')
        .then(response => response.json())
        .then(data => {
          const listaUsuarios = document.getElementById('usuarios-list');
          listaUsuarios.innerHTML = '';  // Limpiar lista antes de agregar elementos
          data.forEach(usuario => {
            const li = document.createElement('li');
            li.textContent = `${usuario.nombre} - ${usuario.email}`;
            listaUsuarios.appendChild(li);
          });
        })
        .catch(error => console.error('Error al cargar usuarios:', error));
    }
  
    // Función para cargar los eventos desde la API
    function cargarEventos() {
      fetch('http://localhost:3000/api/eventos')
        .then(response => response.json())
        .then(data => {
          const listaEventos = document.getElementById('eventos-list');
          listaEventos.innerHTML = '';  // Limpiar lista antes de agregar elementos
          data.forEach(evento => {
            const li = document.createElement('li');
            li.textContent = `${evento.nombre} - ${evento.fecha}`;
            listaEventos.appendChild(li);
          });
        })
        .catch(error => console.error('Error al cargar eventos:', error));
    }
  
    // Cargar datos iniciales
    cargarUsuarios();
    cargarEventos();
  
    // Actualizar cada 5 segundos
    setInterval(() => {
      cargarUsuarios();
      cargarEventos();
    }, 5000);  // 5000 milisegundos = 5 segundos
  });
  