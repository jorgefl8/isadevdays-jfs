
// Definir la matriz de enlaces entre páginas
const enlaces = [
    [0, 1], // Página 0 enlaza a página 1
    [1, 2], // Página 1 enlaza a página 2
    [2, 0], // Página 2 enlaza a página 0
    [2, 3], // Página 2 enlaza a página 3
    [3, 2]  // Página 3 enlaza a página 2
  ];
  
  // Definir el número total de páginas
  const numPaginas = 4;
  
  // Función para calcular el PageRank
  function calcularPageRank(enlaces, numPaginas) {
    const d = 0.85; // Factor de amortiguación
    const numIteraciones = 10; // Número de iteraciones
  
    // Inicializar los valores de PageRank
    let pageRank = new Array(numPaginas).fill(1 / numPaginas);
  
    // Realizar las iteraciones del algoritmo PageRank
    for (let i = 0; i < numIteraciones; i++) {
      let nuevosPageRank = new Array(numPaginas).fill(0);
  
      for (let [paginaOrigen, paginaDestino] of enlaces) {
        nuevosPageRank[paginaDestino] += pageRank[paginaOrigen] / enlaces.filter(([_, dest]) => dest === paginaDestino).length;
      }
  
      for (let j = 0; j < numPaginas; j++) {
        nuevosPageRank[j] = (1 - d) / numPaginas + d * nuevosPageRank[j];
      }
  
      pageRank = nuevosPageRank;
    }
  
    return pageRank;
  }
  
  // Calcular el PageRank
  const resultadoPageRank = calcularPageRank(enlaces, numPaginas);
  console.log("Resultado del PageRank:", resultadoPageRank);
  