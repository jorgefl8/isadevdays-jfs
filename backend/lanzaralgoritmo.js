import { github_pagerank, _callGithubApi } from "./github_pagerank.js";
//const resultado = await github_pagerank("rafnixg", 3, 0.85); //jorgealfonsogarcia
const resultadoapi = await _callGithubApi("rafnixg", 3); //codinghemp
console.log(resultadoapi);

