const noteForm = document.getElementById('newForm');
const noteTitle = document.getElementById('inputNoteTitle');
const noteContent = document.getElementById('InputNoteContent');
const noteCategory = document.getElementById('InputCategory');
const noteTable = document.getElementById('table');
const editForm = document.getElementById('editNote');
const editNoteTitle = document.getElementById('editTitle');
const editNoteContent = document.getElementById('editContent');
const editNoteCategory = document.getElementById('editCategory');
const busquedaForm = document.getElementById('formBusqueda');
const json = localStorage.getItem('notas');
let notas = JSON.parse(json) || [];
let notaId = '';

/* Generador de ID */
var ID = function () {
    return '_' + Math.random().toString(36).substr(2, 9);
};

/* Carga de Formulario */
function submitFormulario(e) {
    e.preventDefault();
    const nota = {
        id: ID(),
        Titulo: noteTitle.value,
        Contenido: noteContent.value,
        Categoria: noteCategory.value,
    };
    notas.push(nota);
    const json = JSON.stringify(notas);
    localStorage.setItem('notas', json);
    mostrarNotas();
    console.log('Se creó una nota exitosamente');
    noteForm.reset();
    const modalDiv = document.getElementById('NuevaNota');
    const modalBootstrap = bootstrap.Modal.getInstance(modalDiv);
    modalBootstrap.hide();
}

/* Mostrar Notas */
function mostrarNotas() {
    let filas = [];
    for (let i = 0; i < notas.length; i++) {
        const nota = notas[i];
        const tr = `
        <tr>
            <td>${nota.Titulo}</td>
            <td>${nota.Categoria}</td>
            <td>
                    <button onclick="mostrarDetalle('${nota.id}')" type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modalDetalle">Detalle</button>
                    <button onclick="cargarModalEditar('${nota.id}')" type="button" class="btn btn-success btn-sm" data-bs-toggle="modal" data-bs-target="#modalEditar">Editar</button>
                    <button onclick="eliminarNota('${nota.id}')" class="btn btn-danger btn-sm">Eliminar</button>
                </td>
        </tr>  
        `;
        filas.push(tr);
    }
    noteTable.innerHTML = filas.join('');
}

/* Eliminar Notas */
function eliminarNota(id) {
    const confirmar = confirm('Presione "Aceptar" para eliminar la nota');
    if (!confirmar) {
        return;
    }

    let notasFiltradas = [];
    for (let i = 0; i < notas.length; i++) {
        const nota = notas[i];
        const coincideId = nota.id === id;
        if (!coincideId) {
            notasFiltradas.push(nota);
        }
    }
    const json = JSON.stringify(notasFiltradas);
    localStorage.setItem('notas', json);
    notas = notasFiltradas;
    console.log('Se eliminó exitosamente un usuario. 👨‍💻');
    mostrarNotas();
}

/* Detalles de Notas */
function mostrarDetalle(id) {
    const notaEncontrada = notas.find((nota) => nota.id === id);
    const noteDetails = document.getElementById('detalleNota')
    const detallesNotas = `
            <p>Titulo: ${notaEncontrada.Titulo}</p>
            <p>Contenido: ${notaEncontrada.Contenido}</p>
            <p>Categoria: ${notaEncontrada.Categoria}</p>
            `;
    noteDetails.innerHTML = detallesNotas;

}


/* Carga para Modal Editar */
function cargarModalEditar(id) {
    const notaEncontrada = notas.find((nota) => nota.id === id);
    editNoteTitle.value = notaEncontrada.Titulo;
    editNoteContent.value = notaEncontrada.Contenido;
    editNoteCategory.value = notaEncontrada.Categoria;
    notaId = notaEncontrada.id;
}

/* Editar Notas */
function editarNota(e) {
    e.preventDefault();
    const notasModificadas = notas.map((nota) => {
        if (nota.id === notaId) {
            const notaModificada = {
                ...nota,
                Titulo: editNoteTitle.value,
                Contenido: editNoteContent.value,
                Categoria: editNoteCategory.value,
            };
            return notaModificada;
        } else {
            return nota;
        }
    });

    const json = JSON.stringify(notasModificadas);
    localStorage.setItem('notas', json);
    notas = notasModificadas;
    console.log('Se modificó satisfactoriamente');
    mostrarNotas();
    const modalDiv = document.getElementById('modalEditar');
    const modalBootstrap = bootstrap.Modal.getInstance(modalDiv);
    modalBootstrap.hide();
}

/* Busqueda por Titulo y Contenido */
function submitBusqueda(e) {
    e.preventDefault();
    const notasLocal = JSON.parse(localStorage.getItem('notas')) || [];
    const busquedaInput = document.getElementById('busqueda');
    const termino = busquedaInput.value.toLowerCase();
    const notasFiltradas = notasLocal.filter((nota) => {
        const tituloEnMinuscula = nota.Titulo.toLowerCase();
        const ContenidoEnMinuscula = nota.Contenido.toLowerCase();
        return tituloEnMinuscula.includes(termino) || ContenidoEnMinuscula.includes(termino);

    });
    notas = notasFiltradas;
    mostrarNotas();
    const alerta = document.getElementById('alertaBusqueda');
    if (notasFiltradas.length === 0) {
        alerta.classList.remove('d-none');
    } else {
        alerta.classList.add('d-none')
    }
};

/* Limpiar Filtro de Búsqueda */
function limpiarFiltro() {
    notas = JSON.parse(localStorage.getItem('notas')) || [];
    busquedaForm.reset();
    mostrarNotas();
    const alerta = document.getElementById('alertaBusqueda');
    alerta.classList.add('d-none');
}

/* Otros */
mostrarNotas();
noteForm.onsubmit = submitFormulario;
editForm.onsubmit = editarNota;
busquedaForm.onsubmit = submitBusqueda;
