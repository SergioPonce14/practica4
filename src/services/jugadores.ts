import {
    esquemaJugadorApi,
    type DatosFormularioJugador,
    type Jugador
} from "../schemas/jugador";

const API_URL = import.meta.env.VITE_API_URL;

export interface RespuestaJugadores {
    jugadores: Jugador[];
    corruptosDescartados: number;
}

export async function obtenerJugadores(): Promise<RespuestaJugadores> {
    const respuesta = await fetch(`${API_URL}/jugadores`);

    if (!respuesta.ok) {
        throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const datosCrudos: unknown = await respuesta.json();

    if (!Array.isArray(datosCrudos)) {
        throw new Error("La API no devolvió una lista válida");
    }

    const jugadores: Jugador[] = [];
    let corruptosDescartados = 0;

    for (const item of datosCrudos) {
        const resultado = esquemaJugadorApi.safeParse(item);
        if (resultado.success) {
            jugadores.push(resultado.data);
        } else {
            corruptosDescartados++;
            console.warn("Dato corrupto atrapado por Zod:", item, resultado.error.issues);
        }
    }

    return { jugadores, corruptosDescartados };
}

export async function crearJugador(datos: DatosFormularioJugador): Promise<Jugador> {
    const cuerpo = {
        nombre: datos.nombre,
        email: datos.email,
        club: datos.club,
        posicion: datos.posicion,
        dorsal: datos.dorsal
    };

    const respuesta = await fetch(`${API_URL}/jugadores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cuerpo)
    });

    if (!respuesta.ok) {
        throw new Error(`Error al crear jugador: ${respuesta.status}`);
    }

    const datoCreado: unknown = await respuesta.json();
    const resultado = esquemaJugadorApi.safeParse(datoCreado);

    if (!resultado.success) {
        throw new Error("La respuesta del servidor no cumple el esquema de jugador");
    }

    return resultado.data;
}

export async function borrarJugador(id: string): Promise<void> {
    const respuesta = await fetch(`${API_URL}/jugadores/${id}`, {
        method: "DELETE"
    });

    if (!respuesta.ok) {
        throw new Error(`Error al borrar jugador: ${respuesta.status}`);
    }
}