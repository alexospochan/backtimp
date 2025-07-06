import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import os from "os";

import inicioSesionRouter from "./routes/iniciodesesion.js";
import usuariosRouter from "./routes/usuarios.js";
import projectsRouter from "./routes/projects.js";
import reportesRouter from "./routes/reportes.js"; 

const app = express();
app.use(express.json());
app.use(cors());

const uri = "mongodb+srv://leandroalexispootchan4:282005.@backend.vysuydk.mongodb.net/TIMPAPP?retryWrites=true&w=majority";

mongoose.connect(uri)
  .then(() => console.log("Conectado a MongoDB Atlas"))
  .catch(err => console.error("Error MongoDB:", err));

app.use("/login", inicioSesionRouter);
app.use("/usuarios", usuariosRouter);
app.use("/proyectos", projectsRouter);
app.use("/reportes", reportesRouter); 

app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente");
});

const PORT = 3000;
const localIP = Object.values(os.networkInterfaces())
  .flat()
  .find((i) => i.family === "IPv4" && !i.internal)?.address || "localhost";

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor escuchando en http://${localIP}:${PORT}`);
});
