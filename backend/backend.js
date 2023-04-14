const ruta = "/api/v1/pagerank";
import  User from "../models/User.js";
import { github_pagerank } from "./github_pagerank.js";

function loadBackend(app) {
  app.get(ruta + "/:username", async (req, res) => {
    const username = req.params.username;
    console.log(`New GET to /pagerank/${computationId}`);
    if (!username) {
      try {
        const users = await User.find();
        if (users) {
          res.json(users);
        } else {
          res.status(404).json({ message: 'There are no users' });
        }
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    } else {
      try {
        const user = await User.findOne({ 'params.username': username });
        if (user) {
          res.json(user);
        } else {
          res.status(404).json({ message: 'User not found' });
        }
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    }
  });
  app.post(ruta+"/:username", async (req, res) => {
    const username = req.params.username;
    const depth = parseInt(req.query.depth);
    const damping_factor = parseNumber(req.query.damping);
    console.log(`New POST to /pagerank/${username}?depth=${depth}&damping=${damping}`);
    const user_alg = await github_pagerank(username, depth, damping_factor);
    if (user_alg == null) {
      res.status(500).send({ message: err.message || "Error al obtener los datos de Github" });
    } else {
      try {
        User.create(user_alg);
        res.status(201).json(user_alg.params.username);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    }
  });
}
export { loadBackend }; 