import cors from "cors";
import { handler } from "./frontend/build/handler.js";
import express from "express";
import { loadBackend } from './backend/backend.js';
import { connectDB } from './db.js';

const deploy = async () => {
  var app = express();
  var port = process.env.PORT ?? 12345;
  app.use(cors());
  app.use(express.json());
  //frontend
  app.use(handler);

  const mongoUrl = process.env.MONGO_URL ?? "mongodb://localhost:27017/github-pagerank";

  connectDB(mongoUrl).then(() => {
    loadBackend(app);
    app.listen(port, () => {
      console.log(`Server escuchando en el puerto ${port}`);
    });
  });
}

const undeploy = async () => {
  process.exit();
}

export default { deploy, undeploy }
