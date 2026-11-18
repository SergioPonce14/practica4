import ListaJugadores from "./components/ListaJugadores";

export default function App() {
    return (
        <>
            <header>
                <h1>⚽ Registro de Jugadores · La Liga</h1>
                
            </header>

            <main className="contenedor-principal">
                <section className="panel-formulario">
                    <h2>Nuevo jugador</h2>
                    <p>por hacer</p>
                </section>

                <ListaJugadores />
            </main>
        </>
    );
}