const ruta = "/pagerank";
import github_pagerank from "./algoritmopagerank.js";
function loadBackend(app) {
  app.get(ruta + ":username", (req, res) => {
    const username = req.params.username;
    const depth = req.query.depth;
    const damping = req.query.damping;
    console.log(`New GET to /pagerank/${username}?depth=${depth}&damping=${damping}`);
  });
}
export { loadBackend }; 