let tareas = [];
let filtroActual = "todas";
let textoBusqueda = "";
let tareaEditandoId = null; 

function toggleDarkMode() {
    document.body.classList.toggle("dark");
    let btn = document.getElementById("darkModeBtn");
    if (document.body.classList.contains("dark")) {
        btn.innerHTML = "Modo Claro";
        localStorage.setItem("darkMode", "true");
    } else {
        btn.innerHTML = "Modo Oscuro";
        localStorage.setItem("darkMode", "false");
    }
}

function cargarDarkMode() {
    let dark = localStorage.getItem("darkMode");
    if (dark === "true") {
        document.body.classList.add("dark");
        document.getElementById("darkModeBtn").innerHTML = "Modo Claro";
    }
}

function cargarTareas() {
    let guardadas = localStorage.getItem("tareas");
    if (guardadas) {
        tareas = JSON.parse(guardadas);
        console.log("Tareas cargadas:", tareas.length);
    }
}

function guardarTareas() {
    localStorage.setItem("tareas", JSON.stringify(tareas));
    console.log(" Tareas guardadas:", tareas.length);
}

// HU1: Agregar tarea (con prioridad - HU7)
function agregarTarea(titulo, descripcion, prioridad) {
    if (!titulo || titulo.trim() === "") {
        return false;
    }
    
    let nuevaTarea = {
        id: Date.now(),
        titulo: titulo.trim(),
        descripcion: descripcion || "",
        completada: false,
        prioridad: prioridad || "media",
        fecha: new Date().toLocaleString()
    };
    
    tareas.push(nuevaTarea);
    guardarTareas();
    console.log("Tarea agregada:", titulo);
    return true;
}

// HU2: Marcar como completada
function completarTarea(id) {
    let tarea = tareas.find(t => t.id === id);
    if (tarea) {
        tarea.completada = !tarea.completada;
        guardarTareas();
        console.log("Tarea:", tarea.completada ? "completada" : "pendiente");
    }
}

// HU4: Eliminar tarea
function eliminarTarea(id) {
    let tareaEliminada = tareas.find(t => t.id === id);
    tareas = tareas.filter(t => t.id !== id);
    guardarTareas();
    console.log("Tarea eliminada:", tareaEliminada?.titulo);
}

// NUEVA FUNCIÓN: Editar tarea
function editarTarea(id, nuevoTitulo, nuevaDescripcion, nuevaPrioridad) {
    let tarea = tareas.find(t => t.id === id);
    if (tarea) {
        if (!nuevoTitulo || nuevoTitulo.trim() === "") {
            alert("El título no puede estar vacío");
            return false;
        }
        tarea.titulo = nuevoTitulo.trim();
        tarea.descripcion = nuevaDescripcion || "";
        tarea.prioridad = nuevaPrioridad;
        tarea.fechaEditada = new Date().toLocaleString();
        guardarTareas();
        console.log("Tarea editada:", tarea.titulo);
        return true;
    }
    return false;
}

// FILTRADO (HU3)
function tareasFiltradas() {
    let resultado = [...tareas];
    
    if (filtroActual === "completadas") {
        resultado = resultado.filter(t => t.completada === true);
    } else if (filtroActual === "pendientes") {
        resultado = resultado.filter(t => t.completada === false);
    }
    
    if (textoBusqueda.trim() !== "") {
        let busqueda = textoBusqueda.toLowerCase();
        resultado = resultado.filter(t => 
            t.titulo.toLowerCase().includes(busqueda) ||
            t.descripcion.toLowerCase().includes(busqueda)
        );
    }
    
    return resultado;
}

// RENDERIZAR
function getPrioridadTexto(prioridad) {
    if (prioridad === "alta") return "🔴 Alta";
    if (prioridad === "media") return "🟡 Media";
    if (prioridad === "baja") return "🟢 Baja";
    return "";
}

function getPrioridadClase(prioridad) {
    if (prioridad === "alta") return "prioridad-alta";
    if (prioridad === "media") return "prioridad-media";
    if (prioridad === "baja") return "prioridad-baja";
    return "";
}

function escapeHTML(texto) {
    if (!texto) return "";
    return texto.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Abrir formulario de edición
function abrirEditor(id) {
    let tarea = tareas.find(t => t.id === id);
    if (!tarea) return;
    
    tareaEditandoId = id;
    
    let editorHTML = `
        <div id="editorOverlay" style="position: fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); display:flex; justify-content:center; align-items:center; z-index:1000;">
            <div style="background:var(--bg-container); padding:25px; border-radius:12px; width:90%; max-width:450px;">
                <h3 style="margin-bottom:15px;">Editar Tarea</h3>
                <input type="text" id="editTitulo" value="${escapeHTML(tarea.titulo)}" placeholder="Título" style="width:100%; padding:10px; margin-bottom:10px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-container); color:var(--text-color);">
                <textarea id="editDescripcion" rows="2" placeholder="Descripción" style="width:100%; padding:10px; margin-bottom:10px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-container); color:var(--text-color);">${escapeHTML(tarea.descripcion)}</textarea>
                <select id="editPrioridad" style="width:100%; padding:10px; margin-bottom:15px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-container); color:var(--text-color);">
                    <option value="alta" ${tarea.prioridad === "alta" ? "selected" : ""}>🔴 Alta</option>
                    <option value="media" ${tarea.prioridad === "media" ? "selected" : ""}>🟡 Media</option>
                    <option value="baja" ${tarea.prioridad === "baja" ? "selected" : ""}>🟢 Baja</option>
                </select>
                <div style="display:flex; gap:10px;">
                    <button id="guardarEditBtn" style="flex:1; padding:10px; background:var(--btn-agregar); color:white; border:none; border-radius:6px; cursor:pointer;"> Guardar</button>
                    <button id="cancelarEditBtn" style="flex:1; padding:10px; background:var(--btn-eliminar); color:white; border:none; border-radius:6px; cursor:pointer;"> Cancelar</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML("beforeend", editorHTML);
    
    document.getElementById("guardarEditBtn").onclick = function() {
        let nuevoTitulo = document.getElementById("editTitulo").value;
        let nuevaDesc = document.getElementById("editDescripcion").value;
        let nuevaPrioridad = document.getElementById("editPrioridad").value;
        
        if (editarTarea(tareaEditandoId, nuevoTitulo, nuevaDesc, nuevaPrioridad)) {
            document.getElementById("editorOverlay").remove();
            renderizar();
            ejecutarPruebas();
        }
    };
    
    document.getElementById("cancelarEditBtn").onclick = function() {
        document.getElementById("editorOverlay").remove();
        tareaEditandoId = null;
    };
}

function renderizar() {
    let lista = document.getElementById("listaTareas");
    let stats = document.getElementById("stats");
    let filtradas = tareasFiltradas();
    let pendientes = tareas.filter(t => !t.completada).length;
    
    if (!lista) return;
    
    if (filtradas.length === 0) {
        lista.innerHTML = '<li class="mensaje-vacio"> No hay tareas</li>';
        if (stats) stats.innerHTML = `${pendientes} pendientes de ${tareas.length} totales`;
        return;
    }
    
    lista.innerHTML = "";
    
    for (let i = 0; i < filtradas.length; i++) {
        let t = filtradas[i];
        let li = document.createElement("li");
        li.className = "tarea-item";
        if (t.completada) {
            li.className += " tarea-completada";
        }
        
        li.innerHTML = `
            <div class="tarea-info">
                <div class="tarea-titulo">
                    ${escapeHTML(t.titulo)}
                    <span class="prioridad-badge ${getPrioridadClase(t.prioridad)}">${getPrioridadTexto(t.prioridad)}</span>
                </div>
                ${t.descripcion ? `<div class="tarea-desc"> ${escapeHTML(t.descripcion)}</div>` : ''}
                <div class="tarea-fecha">
                     Creada: ${t.fecha}
                    ${t.fechaEditada ? ` |  Editada: ${t.fechaEditada}` : ''}
                </div>
            </div>
            <div class="acciones">
                <button class="editar-btn" data-id="${t.id}" style="background:#ffc107; color:#333; border:none; padding:6px 10px; border-radius:6px; cursor:pointer; font-size:12px;">✏️</button>
                <input type="checkbox" class="completar-checkbox" data-id="${t.id}" ${t.completada ? "checked" : ""}>
                <button class="eliminar-btn" data-id="${t.id}">🗑️</button>
            </div>
        `;
        
        lista.appendChild(li);
    }
    
    if (stats) {
        stats.innerHTML = `${pendientes} pendientes de ${tareas.length} totales`;
    }
}

// PRUEBAS TDD
function ejecutarPruebas() {
    let output = document.getElementById("testOutput");
    let resultados = [];
    let pasadas = 0;
    let fallidas = 0;
    
    let original = [...tareas];
    
    // Prueba HU1: Agregar tarea
    tareas = [];
    agregarTarea("Estudiar TDD", "Ver video", "alta");
    if (tareas.length === 1 && tareas[0].titulo === "Estudiar TDD") {
        resultados.push(" HU1: Agregar tarea");
        pasadas++;
    } else {
        resultados.push(" HU1: Agregar tarea");
        fallidas++;
    }
    
    // Prueba HU1: No agregar vacía
    let ok2 = agregarTarea("", "", "media");
    if (tareas.length === 1 && ok2 === false) {
        resultados.push(" HU1: Rechazar tarea vacía");
        pasadas++;
    } else {
        resultados.push(" HU1: Rechazar tarea vacía");
        fallidas++;
    }
    
    // Prueba HU2: Completar tarea
    let idTest = tareas[0]?.id;
    if (idTest) {
        completarTarea(idTest);
        if (tareas[0].completada === true) {
            resultados.push(" HU2: Marcar como completada");
            pasadas++;
        } else {
            resultados.push(" HU2: Marcar como completada");
            fallidas++;
        }
    }
    
    // Prueba HU4: Eliminar tarea
    if (idTest) {
        eliminarTarea(idTest);
        if (tareas.length === 0) {
            resultados.push(" HU4: Eliminar tarea");
            pasadas++;
        } else {
            resultados.push(" HU4: Eliminar tarea");
            fallidas++;
        }
    }
    
    // Prueba Editar tarea
    agregarTarea("Tarea para editar", "Descripción original", "media");
    let idEditar = tareas[0]?.id;
    if (idEditar) {
        editarTarea(idEditar, "Tarea Editada", "Nueva descripción", "alta");
        if (tareas[0].titulo === "Tarea Editada" && tareas[0].prioridad === "alta") {
            resultados.push(" HU3: Editar tarea");
            pasadas++;
        } else {
            resultados.push(" HU3: Editar tarea");
            fallidas++;
        }
    }
    
    // Prueba HU5: LocalStorage
    localStorage.setItem("tareas", JSON.stringify([{id:1, titulo:"test"}]));
    let cargado = localStorage.getItem("tareas");
    if (cargado && cargado.includes("test")) {
        resultados.push(" HU5: LocalStorage");
        pasadas++;
    } else {
        resultados.push(" HU5: LocalStorage");
        fallidas++;
    }
    
    // Restaurar
    tareas = original;
    guardarTareas();
    
    if (output) {
        output.innerHTML = ` Pasadas: ${pasadas}, Fallidas: ${fallidas}\n${resultados.join("\n")}`;
        if (fallidas === 0) {
            output.style.color = "#4ec9b0";
        } else {
            output.style.color = "#f48771";
        }
    }
}

// EVENTOS
function iniciar() {
    cargarDarkMode();
    cargarTareas();
    renderizar();
    ejecutarPruebas();
    
    // Modo oscuro
    let darkBtn = document.getElementById("darkModeBtn");
    if (darkBtn) {
        darkBtn.onclick = toggleDarkMode;
    }
    
    // Agregar tarea
    let agregarBtn = document.getElementById("agregarBtn");
    let tituloInput = document.getElementById("tituloInput");
    let descripcionInput = document.getElementById("descripcionInput");
    let prioridadSelect = document.getElementById("prioridadSelect");
    
    if (agregarBtn) {
        agregarBtn.onclick = function() {
            let titulo = tituloInput.value;
            let descripcion = descripcionInput.value;
            let prioridad = prioridadSelect.value;
            
            if (agregarTarea(titulo, descripcion, prioridad)) {
                tituloInput.value = "";
                descripcionInput.value = "";
                prioridadSelect.value = "media";
                renderizar();
                ejecutarPruebas();
            } else {
                alert(" El título no puede estar vacío");
            }
        };
    }
    
    // Buscar
    let buscarInput = document.getElementById("buscarInput");
    if (buscarInput) {
        buscarInput.oninput = function(e) {
            textoBusqueda = e.target.value;
            renderizar();
        };
    }
    
    // Filtros
    let filtros = document.querySelectorAll(".filtro-btn");
    for (let i = 0; i < filtros.length; i++) {
        filtros[i].onclick = function() {
            for (let j = 0; j < filtros.length; j++) {
                filtros[j].classList.remove("activo");
            }
            this.classList.add("activo");
            filtroActual = this.getAttribute("data-filtro");
            renderizar();
        };
    }
    
    // Completar, eliminar y editar
    let lista = document.getElementById("listaTareas");
    if (lista) {
        lista.onchange = function(e) {
            if (e.target.classList.contains("completar-checkbox")) {
                let id = parseInt(e.target.getAttribute("data-id"));
                completarTarea(id);
                renderizar();
                ejecutarPruebas();
            }
        };
        
        lista.onclick = function(e) {
            if (e.target.classList.contains("eliminar-btn")) {
                let id = parseInt(e.target.getAttribute("data-id"));
                if (confirm("¿Eliminar esta tarea?")) {
                    eliminarTarea(id);
                    renderizar();
                    ejecutarPruebas();
                }
            }
            if (e.target.classList.contains("editar-btn")) {
                let id = parseInt(e.target.getAttribute("data-id"));
                abrirEditor(id);
            }
        };
    }
    
    // Enter para agregar
    if (tituloInput) {
        tituloInput.onkeypress = function(e) {
            if (e.key === "Enter") {
                agregarBtn.click();
            }
        };
    }
}

iniciar(); 
