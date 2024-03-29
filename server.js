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
  

  const mongoUrl = process.env.MONGO_URL ?? "mongodb://127.0.0.1:27017/github-pagerank";

  connectDB(mongoUrl).then(() => {
    loadBackend(app);
    app.use(handler);
    app.listen(port, () => {
      console.log(`Server escuchando en el puerto ${port}`);
    });
  });
}

const undeploy = async () => {
  process.exit();
}

export default { deploy, undeploy }
