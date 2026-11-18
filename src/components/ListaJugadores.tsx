import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { borrarJugador, obtenerJugadores } from "../services/jugadores";

export default function ListaJugadores() {
    const queryClient = useQueryClient();

    const { data, isPending, isError, error, isFetching } = useQuery({
        queryKey: ["jugadores"],
        queryFn: obtenerJugadores,
        // 60 s frescos: evita refetches innecesarios al cambiar de pestaña; las mutaciones invalidan al instante
        staleTime: 60_000
    });

    const mutacionBorrar = useMutation({
        mutationFn: borrarJugador,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jugadores"] });
        }
    });

    if (isPending) {
        return (
            <div className="estado-carga" role="status">
                <p>⏳ Cargando jugadores...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="estado-error" role="alert">
                <p>⚠ Error al cargar jugadores: {error.message}</p>
            </div>
        );
    }

    const { jugadores, corruptosDescartados } = data;

    return (
        <section>
            <div className="cabecera-listado">
                <h2>Plantilla registrada ({jugadores.length})</h2>
                {isFetching && <span role="status">🔄 Actualizando...</span>}
            </div>

            {corruptosDescartados > 0 && (
                <div className="aviso-corrupto" role="status">
                    🛡 Zod (<code>safeParse</code>) ha detectado y descartado{" "}
                    <strong>{corruptosDescartados}</strong> registro(s) corrupto(s) del servidor.
                    Revisa la consola para ver <code>error.issues</code>.
                </div>
            )}

            {mutacionBorrar.isError && (
                <p className="mensaje-error" role="alert">
                    {mutacionBorrar.error.message}
                </p>
            )}

            {jugadores.length === 0 ? (
                <div className="estado-vacio">
                    <p>📭 No hay jugadores registrados todavía.</p>
                </div>
            ) : (
                <div className="grid-equipos">
                    {jugadores.map((jugador) => (
                        <article key={jugador.id} className="tarjeta-equipo">
                            <span className="dorsal-badge">#{jugador.dorsal}</span>
                            <h3>{jugador.nombre}</h3>
                            <p>🏟 {jugador.club}</p>
                            <p>📌 {jugador.posicion}</p>
                            <p>✉ {jugador.email}</p>

                            <button
                                type="button"
                                className="btn-borrar"
                                disabled={mutacionBorrar.isPending}
                                onClick={() => mutacionBorrar.mutate(jugador.id)}
                            >
                                {mutacionBorrar.isPending ? "Borrando..." : "🗑 Eliminar"}
                            </button>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}