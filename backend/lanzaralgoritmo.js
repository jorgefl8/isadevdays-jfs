import { github_pagerank, _callGithubApi } from "./github-pagerank.js";
const resultado = await github_pagerank("danarcanjosilva", 3, 0.85); //jorgealfonsogarcia
//const resultadoapi = await _callGithubApi("danarcanjosilva", 3); //codinghemp
console.log(resultado);

