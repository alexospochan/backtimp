import express from "express";
import Reporte from "../models/Reporte.js";

const router = express.Router();

// Ruta para obtener todos los reportes (opcional)
router.get("/", async (req, res) => {
  try {
    const reportes = await Reporte.find();
    res.json(reportes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener reportes" });
  }
});

// Ruta para obtener reportes de un proyecto específico
router.get("/proyecto/:idProyecto", async (req, res) => {
  try {
    const { idProyecto } = req.params;
    const reportes = await Reporte.find({ proyectoId: idProyecto });
    res.json(reportes);
  } catch (error) {
    console.error("Error obteniendo reportes por proyecto:", error);
    res.status(500).json({ error: "Error al obtener reportes por proyecto" });
  }
});

export default router;
