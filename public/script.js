document.addEventListener('DOMContentLoaded', function () {
    // Función para cargar los usuarios desde la API
    function cargarUsuarios() {
      fetch('/api/usuarios')
        .then(response => response.json())
        .then(data => {
          const listaUsuarios = document.getElementById('usuarios-list');
          const selectUsuarios = document.getElementById('id-usuario');
          listaUsuarios.innerHTML = '';
          selectUsuarios.innerHTML = '';
  
          data.forEach(usuario => {
            const li = document.createElement('li');
            li.textContent = `${usuario.nombre} - ${usuario.email}`;
  
            // Crear botón de eliminar
            const eliminarBtn = document.createElement('button');
            eliminarBtn.textContent = 'Eliminar';
            eliminarBtn.addEventListener('click', () => eliminarUsuario(usuario.id));
  
            li.appendChild(eliminarBtn);
            listaUsuarios.appendChild(li);
  
            const option = document.createElement('option');
            option.value = usuario.id;
            option.textContent = `${usuario.nombre} - ${usuario.email}`;
            selectUsuarios.appendChild(option);
          });
        })
        .catch(error => console.error('Error al cargar usuarios:', error));
    }
  
    // Función para eliminar un usuario
    function eliminarUsuario(id) {
        console.log("ID del usuario a eliminar:", id);  // Imprimir el ID del usuario
        fetch(`/api/usuarios/${id}`, {
          method: 'DELETE',
        })
          .then(response => {
            if (response.ok) {
              console.log('Usuario eliminado');
              cargarUsuarios();  // Recargar los usuarios para reflejar el nuevo usuario
            } else {
              console.error('Error al eliminar usuario', response.statusText);
            }
          })
          .catch(error => console.error('Error al eliminar usuario:', error));
      }
  
    // Función para cargar los eventos desde la API
    function cargarEventos() {
      fetch('/api/eventos')
        .then(response => response.json())
        .then(data => {
          const listaEventos = document.getElementById('eventos-list');
          listaEventos.innerHTML = '';
          data.forEach(evento => {
            const li = document.createElement('li');
            li.textContent = `${evento.nombre} - ${evento.fecha}`;
  
            // Crear botón de eliminar
            const eliminarBtn = document.createElement('button');
            eliminarBtn.textContent = 'Eliminar';
            eliminarBtn.addEventListener('click', () => eliminarEvento(evento.id));
  
            li.appendChild(eliminarBtn);
            listaEventos.appendChild(li);
          });
        })
        .catch(error => console.error('Error al cargar eventos:', error));
    }
  
    // Función para eliminar un evento
    function eliminarEvento(id) {
        console.log("ID del evento a eliminar:", id);  // Imprimir el ID del evento
        fetch(`/api/eventos/${id}`, {
          method: 'DELETE',
        })
          .then(response => {
            if (response.ok) {
              console.log('Evento eliminado');
              cargarEventos();  // Recargar los eventos para reflejar el nuevo evento
            } else {
              console.error('Error al eliminar evento', response.statusText);
            }
          })
          .catch(error => console.error('Error al eliminar evento:', error));
      }
  
    // Función para agregar un usuario
    function agregarUsuario(event) {
      event.preventDefault();
      const nombreUsuario = document.getElementById('nombre-usuario').value;
      const emailUsuario = document.getElementById('email-usuario').value;
  
      if (!nombreUsuario || !emailUsuario) {
        alert('Por favor, complete todos los campos.');
        return;
      }
  
      const nuevoUsuario = {
        nombre: nombreUsuario,
        email: emailUsuario,
      };
  
      fetch('/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoUsuario),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Usuario añadido:', data);
          cargarUsuarios();  // Recargar los usuarios para reflejar el nuevo usuario
        })
        .catch(error => console.error('Error al añadir usuario:', error));
    }
  
    // Función para agregar un evento
    function agregarEvento(event) {
      event.preventDefault();
      
      const nombreEvento = document.getElementById('nombre-evento').value;
      const idUsuario = document.getElementById('id-usuario').value;
      const fechaEvento = document.getElementById('fecha-evento').value;
  
      if (!nombreEvento || !idUsuario || !fechaEvento) {
        alert('Por favor, complete todos los campos.');
        return;
      }
  
      const nuevoEvento = {
        nombre: nombreEvento,
        id_usuario: idUsuario,
        fecha: fechaEvento,
      };
  
      fetch('/api/eventos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoEvento),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Evento añadido:', data);
          cargarEventos();  // Recargar los eventos para reflejar el nuevo evento
        })
        .catch(error => console.error('Error al añadir evento:', error));
    }
  
    // Cargar datos iniciales
    cargarUsuarios();
    cargarEventos();
  
    // Actualizar cada 5 segundos
    setInterval(() => {
      cargarUsuarios();
      cargarEventos();
    }, 5000);  // 5000 milisegundos = 5 segundos
  
    // Manejar el envío del formulario de usuario
    const usuarioForm = document.getElementById('usuario-form');
    usuarioForm.addEventListener('submit', agregarUsuario);
  
    // Manejar el envío del formulario de evento
    const eventoForm = document.getElementById('evento-form');
    eventoForm.addEventListener('submit', agregarEvento);
  });
  