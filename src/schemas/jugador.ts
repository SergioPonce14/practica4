import { z } from "zod";

export const POSICIONES = ["Portero", "Defensa", "Centrocampista", "Delantero"] as const;

// Campos comunes entre el formulario y la respuesta del servidor
const esquemaJugadorBase = z.object({
    nombre: z
        .string()
        .trim()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(50, "El nombre no puede superar los 50 caracteres"),
    email: z.email("Introduce un correo electrónico válido"),
    club: z
        .string()
        .trim()
        .min(2, "El club debe tener al menos 2 caracteres"),
    posicion: z.enum(POSICIONES, {
        error: "Selecciona una posición válida"
    }),
    dorsal: z.coerce
        .number({ error: "Introduce un dorsal numérico" })
        .int("El dorsal debe ser un número entero")
        .min(1, "El dorsal mínimo es 1")
        .max(99, "El dorsal máximo es 99")
});

//(un portero solo puede llevar 1, 13 o 25)
function validarDorsalPortero(datos: { posicion: string; dorsal: number }) {
    if (datos.posicion === "Portero") {
        return [1, 13, 25].includes(datos.dorsal);
    }
    return true;
}

const reglaPortero = {
    error: "En La Liga, un portero solo puede llevar el dorsal 1, 13 o 25",
    path: ["dorsal"]
};

// Esquema para el formulario (añade el checkbox obligatorio)
export const esquemaFormularioJugador = esquemaJugadorBase
    .extend({
        aceptaNormas: z.literal(true, {
            error: "Debes aceptar la normativa de inscripción"
        })
    })
    .refine(validarDorsalPortero, reglaPortero);

//  Esquema para validar lo que responde el API 
export const esquemaJugadorApi = esquemaJugadorBase
    .extend({
        id: z.string()
    })
    .refine(validarDorsalPortero, reglaPortero);

// Tipos inferidos automáticamente desde Zod (única fuente de verdad)
export type DatosFormularioJugador = z.infer<typeof esquemaFormularioJugador>;
export type Jugador = z.infer<typeof esquemaJugadorApi>;