import User from "../models/User.js";
import { github_pagerank } from "./github_pagerank.js";

const ruta = "/api/v1/pagerank";


function loadBackend(app) {
  app.get(ruta + '/docs', function (req, res) {
    res.status(301).redirect('https://documenter.getpostman.com/view/26013124/2s93XwzjWp');
  });
  app.get(ruta + "/:username", async (req, res) => {
    const username = req.params.username;
    console.log(`New GET to /pagerank/${username}`);
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
  });
  app.get(ruta, async (req, res) => {
    console.log(`New GET to /pagerank`);
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
  });

app.post(ruta + '/:username', async (req, res) => {
  const username = req.params.username;
  const depth = parseInt(req.query.depth);
  const damping_factor = parseFloat(req.query.damping);
  console.log(`New POST to /pagerank/${username}?depth=${depth}&damping=${damping_factor}`);
  const user_alg = await github_pagerank(username, depth, damping_factor);
  if (user_alg == null) {
    res.status(500).send({ message: err.message || "Error al obtener los datos de Github" });
  } else {
    try {
      User.create(user_alg);
      const resul = { "username": user_alg.params.username};
      res.status(201).json(resul);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
});
app.delete(ruta, async (req, res) => {
  console.log(`New DELETE to /pagerank`);
  try {
    User.collection.deleteMany({});
    console.log(`Recursos borrados correctamente.`);
    res.status(200).send("Recursos borrados correctamente.");

  } catch (err) {
    console.log(`Ha habido un error borrando los usuarios: ${err}`);
    res.sendStatus(500);
  }
});
app.delete(ruta + "/:username", async (req, res) => {
  const username = req.params.username;
  console.log(`New DELETE to /pagerank/${username}`);
  try {
    User.collection.deleteOne({ "params.username": username });
    console.log(`Recurso /${username} borrado correctamnte.`);
    res.status(200).send("El recurso se ha borrado correctamente.");

  } catch (err) {
    console.log(`Ha habido un error borrando el recurso del usuario ${username}: ${err}`);
    res.sendStatus(500);
  }
});
}
export { loadBackend }; 