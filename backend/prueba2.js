import axios from "axios";
// Definir el nombre de usuario del seguidor dado y el token de acceso a la API de GitHub
const usuarioSeguidor = 'jorgealfonsogarcia';
const tokenAcceso = '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';


// Función para obtener el primer seguidor de un usuario en GitHub
async function obtenerPrimerSeguidor(usuario) {
    try {
        const respuesta = await axios.get(`https://api.github.com/users/${usuario}/followers`, {
            headers: {
                'Authorization': `Bearer ${tokenAcceso}` // Incluir el token de acceso en la cabecera de la petición
            }
        });
        const seguidores = respuesta.data;

        if (seguidores.length > 0) {
            return seguidores[0].login; // Obtener el login del primer seguidor
        } else {
            console.log(`El usuario ${usuario} no tiene seguidores.`);
        }
    } catch (error) {
        console.error(`Error al obtener los seguidores de ${usuario}: ${error.message}`);
    }
}

// Función para calcular el PageRank
async function calcularPageRank(usuario) {
    const pageRank = {}; // Objeto para almacenar los resultados del PageRank
    const numIteraciones = 10; // Número de iteraciones

    for (let i = 0; i < numIteraciones; i++) {
        const primerSeguidor = await obtenerPrimerSeguidor(usuario); // Obtener el primer seguidor del usuario dado

        if (primerSeguidor) {
            if (pageRank[primerSeguidor]) {
                pageRank[primerSeguidor]++; // Incrementar el contador del PageRank del seguidor
            } else {
                pageRank[primerSeguidor] = 1; // Inicializar el contador del PageRank del seguidor
            }

            usuario = primerSeguidor; // Establecer el primer seguidor como el nuevo usuario para la siguiente iteración
        } else {
            console.log(`No se pudo obtener el primer seguidor de ${usuario}.`);
            break;
        }
    }

    return pageRank;
}

// Calcular el PageRank y mostrar los resultados
calcularPageRank(usuarioSeguidor)
    .then(resultadoPageRank => {
        console.log("Resultado del PageRank:", resultadoPageRank);
    })
    .catch(error => {
        console.error(`Error al calcular el PageRank: ${error.message}`);
    });