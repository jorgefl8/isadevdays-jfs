import { github_pagerank, _callGithubApi } from "./github-pagerank.js";
const resultado = await github_pagerank("jorgealfonsogarcia", 3, 0.85);
//const resultadoapi = await _callGithubApi("codinghemp", 3); //codinghemp
console.log(resultado);


