// Sistema de gestión de datos con localStorage
const AppData = {
    // Obtener todos los datos
    obtenerDatos() {
        const datos = localStorage.getItem('appData');
        return datos ? JSON.parse(datos) : this.datosVacios();
    },

    // Datos vacíos por defecto
    datosVacios() {
        return {
            jugadoras: [],
            calendario: [],
            asistencia: [],
            peso: [],
            rpe: [],
            configuracion: {
                nombreEquipo: 'Mi Equipo',
                entrenador: 'Entrenador',
                temporada: new Date().getFullYear()
            }
        };
    },

    // Guardar datos
    guardarDatos(datos) {
        localStorage.setItem('appData', JSON.stringify(datos));
        console.log('✅ Datos guardados');
    },

    // Agregar jugadora
    agregarJugadora(jugadora) {
        const datos = this.obtenerDatos();
        jugadora.id = Date.now();
        jugadora.fechaCreacion = new Date().toISOString();
        datos.jugadoras.push(jugadora);
        this.guardarDatos(datos);
        return jugadora;
    },

    // Obtener jugadoras
    obtenerJugadoras() {
        return this.obtenerDatos().jugadoras;
    },

    // Actualizar jugadora
    actualizarJugadora(id, jugadora) {
        const datos = this.obtenerDatos();
        const index = datos.jugadoras.findIndex(j => j.id == id);
        if (index !== -1) {
            datos.jugadoras[index] = { ...datos.jugadoras[index], ...jugadora };
            this.guardarDatos(datos);
        }
    },

    // Eliminar jugadora
    eliminarJugadora(id) {
        const datos = this.obtenerDatos();
        datos.jugadoras = datos.jugadoras.filter(j => j.id != id);
        this.guardarDatos(datos);
    },

    // Agregar evento al calendario
    agregarEvento(evento) {
        const datos = this.obtenerDatos();
        evento.id = Date.now();
        evento.fechaCreacion = new Date().toISOString();
        datos.calendario.push(evento);
        this.guardarDatos(datos);
        return evento;
    },

    // Obtener eventos ordenados
    obtenerEventos() {
        const datos = this.obtenerDatos();
        return datos.calendario.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    },

    // Eliminar evento
    eliminarEvento(id) {
        const datos = this.obtenerDatos();
        datos.calendario = datos.calendario.filter(e => e.id != id);
        this.guardarDatos(datos);
    },

    // Agregar registro de asistencia
    agregarAsistencia(asistencia) {
        const datos = this.obtenerDatos();
        asistencia.id = Date.now();
        asistencia.fecha = new Date().toISOString();
        datos.asistencia.push(asistencia);
        this.guardarDatos(datos);
        return asistencia;
    },

    // Obtener asistencias
    obtenerAsistencias() {
        return this.obtenerDatos().asistencia.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    },

    // Agregar registro de peso
    agregarPeso(registro) {
        const datos = this.obtenerDatos();
        registro.id = Date.now();
        registro.fecha = new Date().toISOString();
        // Calcular IMC si hay altura
        if (registro.altura && registro.peso) {
            const altura = registro.altura / 100;
            registro.imc = (registro.peso / (altura * altura)).toFixed(2);
        }
        datos.peso.push(registro);
        this.guardarDatos(datos);
        return registro;
    },

    // Obtener registros de peso
    obtenerPeso() {
        return this.obtenerDatos().peso.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    },

    // Agregar RPE
    agregarRPE(rpe) {
        const datos = this.obtenerDatos();
        rpe.id = Date.now();
        rpe.fecha = new Date().toISOString();
        datos.rpe.push(rpe);
        this.guardarDatos(datos);
        return rpe;
    },

    // Obtener RPE
    obtenerRPE() {
        return this.obtenerDatos().rpe.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    },

    // Buscar jugadora
    buscarJugadora(termino) {
        const jugadoras = this.obtenerJugadoras();
        return jugadoras.filter(j => 
            j.nombre.toLowerCase().includes(termino.toLowerCase()) ||
            j.numero?.toString().includes(termino)
        );
    }
};

// Funciones útiles
function formatearFecha(fecha) {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatearHora(fecha) {
    const date = new Date(fecha);
    return date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function obtenerFechaActual() {
    return new Date().toISOString().split('T')[0];
}

// Modal helper
function abrirModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function cerrarModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Exportar a CSV
function exportarCSV(datos, nombreArchivo) {
    if (!datos || datos.length === 0) {
        alert('No hay datos para exportar');
        return;
    }

    const headers = Object.keys(datos[0]);
    const csv = [
        headers.join(','),
        ...datos.map(row => 
            headers.map(header => {
                const value = row[header];
                return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
            }).join(',')
        )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo + '.csv';
    a.click();
}

// Agregar datos de ejemplo
function agregarDatosEjemplo() {
    const datos = AppData.datosVacios();

    // Jugadoras de ejemplo
    datos.jugadoras = [
        { id: 1, nombre: 'María García', numero: 1, posicion: 'Portero', altura: 180, peso: 75, email: 'maria@example.com' },
        { id: 2, nombre: 'Ana López', numero: 2, posicion: 'Defensa', altura: 170, peso: 65, email: 'ana@example.com' },
        { id: 3, nombre: 'Sofia Martínez', numero: 3, posicion: 'Defensa', altura: 168, peso: 63, email: 'sofia@example.com' },
    ];

    // Eventos de ejemplo
    datos.calendario = [
        { id: 1, fecha: new Date().toISOString().split('T')[0], hora: '19:00', tipo: 'Entrenamiento', lugar: 'Cancha Principal' },
        { id: 2, fecha: new Date(Date.now() + 86400000).toISOString().split('T')[0], hora: '15:00', tipo: 'Partido', lugar: 'Estadio Municipal' },
    ];

    AppData.guardarDatos(datos);
    alert('✅ Datos de ejemplo agregados');
}

// Inicializar si es la primera vez
if (!localStorage.getItem('appData')) {
    AppData.guardarDatos(AppData.datosVacios());
}
