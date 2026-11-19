import FormularioJugador from "./components/FormularioJugador";
import ListaJugadores from "./components/ListaJugadores";

export default function App() {
    return (
        <>
            <header>
                <h1> Registro de Jugadores - La Liga</h1>
            </header>

            <main className="contenedor-principal">
                <FormularioJugador />
                <ListaJugadores />
            </main>
        </>
    );
}