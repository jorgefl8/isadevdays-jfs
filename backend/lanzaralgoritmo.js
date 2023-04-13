import { github_pagerank, _callGithubApi } from "./github_pagerank.js";
const resultado = await github_pagerank("rafnixg", 3, 0.85); //jorgealfonsogarcia
//const resultadoapi = await _callGithubApi("jorgealfonsogarcia", 3); //codinghemp
console.log(resultado);

/*import { github_pagerank, callGitHubApi} from "./prueba1.js";
const resul = await github_pagerank("jorgealfonsogarcia", 3, 0.85); 
const resulapi = await callGitHubApi("C191068");
console.log(resul);*/