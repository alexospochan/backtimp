import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import os from "os";
import dotenv from "dotenv";

// Importar routers
import inicioSesionRouter from "./routes/iniciodesesion.js";
import usuariosRouter from "./routes/usuarios.js";
import projectsRouter from "./routes/projects.js";
import reportesRouter from "./routes/reportes.js";

// Carga las variables del archivo .env
dotenv.config();

const app = express();

// Middlewares
app.use(express.json());  // Para parsear JSON en el body
app.use(cors());          // Permite peticiones cross-origin (desde otras IPs o puertos)

// Conexion a MongoDB usando variable de entorno
const uri = process.env.MONGO_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Conectado a MongoDB Atlas"))
  .catch(err => console.error("Error MongoDB:", err));

// Rutas de la API
app.use("/login", inicioSesionRouter);
app.use("/usuarios", usuariosRouter);
app.use("/proyectos", projectsRouter);
app.use("/reportes", reportesRouter); // Aquí se monta el router de reportes

// Ruta base
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente");
});

// Puerto y IP local para escuchar
const PORT = process.env.PORT || 3000;

// Obtener IP local para mostrar en consola (útil para dispositivos móviles en red)
const localIP = Object.values(os.networkInterfaces())
  .flat()
  .find((i) => i.family === "IPv4" && !i.internal)?.address || "localhost";

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor escuchando en http://${localIP}:${PORT}`);
});
