///// Manejo del modal de registro
const btnRegistroModal = document.querySelector('#registro-modal');
const btnOcultarRegistroModal = document.querySelector('#ocultar-registroModal');
const contRegistro = document.querySelector('.contenedor-registroModal');
const nombreInput = document.querySelector('#nombre');
const puestoInput = document.querySelector('#puesto');

// Evento para mostrar el modal de registro
btnRegistroModal.addEventListener('click', (e) => {
    e.preventDefault();
    contRegistro.classList.add('mostrar-registro');
});

// Evento para ocultar el modal de registro y agregar información a la interfaz
btnOcultarRegistroModal.addEventListener('click', (e) => {
    e.preventDefault();
    contRegistro.classList.remove('mostrar-registro');

    const empleado = document.querySelector('.botones__contenedor');

    // Crear elementos de párrafo para mostrar la información ingresada
    const pNombre = document.createElement('p');
    pNombre.textContent = nombreInput.value;

    const pPuesto = document.createElement('p');
    pPuesto.textContent = puestoInput.value;

    // Agregar los elementos de párrafo a la interfaz
    empleado.appendChild(pNombre);
    empleado.appendChild(pPuesto);
});

// Evento para cerrar el modal de registro
const btnCerrarRegistroModal = document.querySelector('#cerrar-registroModal');
btnCerrarRegistroModal.addEventListener('click', (e) => {
    e.preventDefault();
    contRegistro.classList.remove('mostrar-registro');
});

// Evento para cerrar el modal de registro en dispositivos de escritorio
const btnCerrarRegistroModalDesktop = document.querySelector('#cerrar-registroModalDesktop');
btnCerrarRegistroModalDesktop.addEventListener('click', (e) => {
    e.preventDefault();
    contRegistro.classList.remove('mostrar-registro');
});




//// Manejo del modal de puesto
const btnPuestoModal = document.querySelector('#puesto-modal');
const btnOcultarModal = document.querySelector('#ocultar-modal');
const contPuestoModal = document.querySelector('.contenedor-modal');
const NombreInput = document.querySelector('#nombre');
const PuestoInput = document.querySelector('#puesto');

// Evento para mostrar el modal de puesto
btnPuestoModal.addEventListener('click', (e) => {
    e.preventDefault();
    contPuestoModal.classList.add('mostrar-puesto');
});

// Evento para ocultar el modal de puesto y agregar información a la interfaz
btnOcultarModal.addEventListener('click', (e) => {
    e.preventDefault();
    contPuestoModal.classList.remove('mostrar-puesto');

    const empleados = document.querySelector('.perfil__enlaces');
    // const empleados = document.querySelector('.tabla__acciones');

    // Crear elementos de párrafo para mostrar la información ingresada
    const pNombre = document.createElement('p');
    pNombre.textContent = NombreInput.value;

    const pPuesto = document.createElement('p');
    pPuesto.textContent = PuestoInput.value;

    // Agregar los elementos de párrafo a la interfaz
    empleados.appendChild(pNombre);
    empleados.appendChild(pPuesto);
});

// Evento para cerrar el modal de puesto
const btnCerrarPuestoModal = document.querySelector('#cerrar-puestoModal');
btnCerrarPuestoModal.addEventListener('click', (e) => {
    e.preventDefault();
    contPuestoModal.classList.remove('mostrar-puesto');
});


// Agrega este código al final de tu archivo o dentro de una etiqueta <script>


document.addEventListener('DOMContentLoaded', function () {
    const abrirModalLinks = document.querySelectorAll('.abrir-modal');

    abrirModalLinks.forEach(link => {
        link.addEventListener('click', function () {
            const modalId = this.getAttribute('data-modal');
            const modal = document.querySelector(`.${modalId}`);
            modal.style.display = 'block';
        });
    });

    // Cerrar modal al hacer clic en el botón de cerrar
    const cerrarModalBtns = document.querySelectorAll('.cerrar-modal');
    cerrarModalBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const modal = this.closest('.modal');
            modal.style.display = 'none';
        });
    });
});
