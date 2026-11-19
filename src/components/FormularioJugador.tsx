import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    esquemaFormularioJugador,
    POSICIONES,
    type DatosFormularioJugador
} from "../schemas/jugador";
import { crearJugador } from "../services/jugadores";

export default function FormularioJugador() {
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(esquemaFormularioJugador),
        defaultValues: {
            nombre: "",
            email: "",
            club: "",
            posicion: "Delantero"
        }
    });

    const mutacion = useMutation({
        mutationFn: crearJugador,
        onSuccess: () => {
            reset();
            queryClient.invalidateQueries({ queryKey: ["jugadores"] });
        }
    });

    function onSubmit(datos: DatosFormularioJugador) {
        mutacion.mutate(datos);
    }

    return (
        <section className="panel-formulario">
            <h2>Inscribir jugador</h2>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="campo-form">
                    <label htmlFor="nombre">Nombre completo</label>
                    <input
                        id="nombre"
                        type="text"
                        autoComplete="name"
                        placeholder="Ej. Lamine Yamal"
                        aria-invalid={!!errors.nombre}
                        aria-describedby={errors.nombre ? "error-nombre" : undefined}
                        {...register("nombre")}
                    />
                    {errors.nombre && (
                        <p id="error-nombre" className="mensaje-error" role="alert">
                            {errors.nombre.message}
                        </p>
                    )}
                </div>

                <div className="campo-form">
                    <label htmlFor="email">Correo electrónico</label>
                    <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="jugador@club.com"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "error-email" : undefined}
                        {...register("email")}
                    />
                    {errors.email && (
                        <p id="error-email" className="mensaje-error" role="alert">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div className="campo-form">
                    <label htmlFor="club">Club</label>
                    <input
                        id="club"
                        type="text"
                        placeholder="Ej. RCD Espanyol"
                        aria-invalid={!!errors.club}
                        aria-describedby={errors.club ? "error-club" : undefined}
                        {...register("club")}
                    />
                    {errors.club && (
                        <p id="error-club" className="mensaje-error" role="alert">
                            {errors.club.message}
                        </p>
                    )}
                </div>

                <div className="campo-form">
                    <label htmlFor="posicion">Posición</label>
                    <select
                        id="posicion"
                        aria-invalid={!!errors.posicion}
                        aria-describedby={errors.posicion ? "error-posicion" : undefined}
                        {...register("posicion")}
                    >
                        {POSICIONES.map((pos) => (
                            <option key={pos} value={pos}>
                                {pos}
                            </option>
                        ))}
                    </select>
                    {errors.posicion && (
                        <p id="error-posicion" className="mensaje-error" role="alert">
                            {errors.posicion.message}
                        </p>
                    )}
                </div>

                <div className="campo-form">
                    <label htmlFor="dorsal">Dorsal (1-99)</label>
                    <input
                        id="dorsal"
                        type="number"
                        placeholder="Ej. 10 (porteros: 1, 13 o 25)"
                        aria-invalid={!!errors.dorsal}
                        aria-describedby={errors.dorsal ? "error-dorsal" : undefined}
                        {...register("dorsal")}
                    />
                    {errors.dorsal && (
                        <p id="error-dorsal" className="mensaje-error" role="alert">
                            {errors.dorsal.message}
                        </p>
                    )}
                </div>

                <div className="campo-form">
                    <label className="campo-checkbox" htmlFor="aceptaNormas">
                        <input
                            id="aceptaNormas"
                            type="checkbox"
                            aria-invalid={!!errors.aceptaNormas}
                            aria-describedby={
                                errors.aceptaNormas ? "error-aceptaNormas" : undefined
                            }
                            {...register("aceptaNormas")}
                        />
                        <span>Acepto la normativa oficial de inscripción</span>
                    </label>
                    {errors.aceptaNormas && (
                        <p id="error-aceptaNormas" className="mensaje-error" role="alert">
                            {errors.aceptaNormas.message}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    className="btn-primario"
                    disabled={mutacion.isPending}
                >
                    {mutacion.isPending ? "Inscribiendo..." : "Registrar jugador"}
                </button>

                {mutacion.isError && (
                    <p className="mensaje-error" role="alert">
                        ⚠ {mutacion.error.message}
                    </p>
                )}

                {mutacion.isSuccess && (
                    <p className="mensaje-exito" role="status">
                        ✓ Jugador inscrito correctamente.
                    </p>
                )}
            </form>
        </section>
    );
}