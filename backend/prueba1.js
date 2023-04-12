// Importar una librería de manejo de peticiones HTTP, como axios
// npm install axios
import axios from "axios";

// URL base de la API de GitHub
const BASE_URL = 'https://api.github.com';

// Función para obtener el primer seguidor de un usuario en GitHub
async function obtenerPrimerSeguidor(usuario) {
    try {
        const respuesta = await axios.get(`${BASE_URL}/users/${usuario}/followers`);
        const seguidores = respuesta.data;
        if (seguidores.length > 0) {
            return seguidores[0].login;
        } else {
            console.log(`El usuario "${usuario}" no tiene seguidores en GitHub.`);
            return null;
        }
    } catch (error) {
        console.error(`Error al obtener los seguidores del usuario "${usuario}":`, error);
        return null;
    }
}

// Función para calcular el PageRank
async function calcularPageRank(usuarioInicial) {
    const d = 0.85; // Factor de amortiguación
    const numIteraciones = 10; // Número de iteraciones

    let usuarioActual = usuarioInicial;
    const pageRank = new Map();
    pageRank.set(usuarioActual, 1); // Inicializar el PageRank del usuario inicial en 1

    // Realizar las iteraciones del algoritmo PageRank
    for (let i = 0; i < numIteraciones; i++) {
        const nuevoPageRank = new Map();
        const primerSeguidor = await obtenerPrimerSeguidor(usuarioActual);
        if (!primerSeguidor) {
            break; // Si no hay primer seguidor, salir del bucle
        }
        nuevoPageRank.set(primerSeguidor, d * pageRank.get(usuarioActual));
        pageRank.forEach((valor, usuario) => {
            if (usuario !== usuarioActual) {
                nuevoPageRank.set(usuario, (1 - d) / pageRank.size);
            }
        });
        usuarioActual = primerSeguidor;
        nuevoPageRank.forEach((valor, usuario) => {
            pageRank.set(usuario, valor);
        });
    }

    return pageRank;
}

// Calcular el PageRank del primer seguidor de un usuario dado en GitHub
const usuarioInicial = 'jorgealfonsogarcia';
calcularPageRank(usuarioInicial)
    .then(resultadoPageRank => {
        console.log(`Resultado del PageRank del primer seguidor de "${usuarioInicial}":`, resultadoPageRank);
    })
    .catch(error => {
        console.error(`Error al calcular el PageRank del primer seguidor de "${usuarioInicial}":`, error);
    });
