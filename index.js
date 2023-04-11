import cors from "cors";
import { handler } from "./frontend/build/handler.js";
import express from "express";
import { loadBackend } from './backend/backend.js';
import { connectDB } from './db.js';

var app = express();
var port = process.env.PORT || 12345;
app.use(cors());
app.use(express.json());
app.use(handler);


const mongoUrl = "mongodb://localhost:27017/github-pagerank";

connectDB(mongoUrl).then(() => {
  loadBackend(app);
  app.listen(port, () => {
      console.log(`Server escuchando en el puerto ${port}`);
  });
});
