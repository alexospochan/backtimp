import express from "express";
import mongoose from "mongoose";
import Reporte from "../models/Reporte.js";
import Proyecto from "../models/Project.js";

const router = express.Router();

// Obtener todos los reportes (admin)
router.get("/", async (req, res) => {
  try {
    const reportes = await Reporte.find()
      .populate("proyectoId")
      .populate("leidoPor");
    res.json(reportes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener reportes" });
  }
});

// Obtener reportes por proyecto (jefe)
router.get("/proyecto/:proyectoId", async (req, res) => {
  try {
    const { proyectoId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(proyectoId)) {
      return res.status(400).json({ message: "ID de proyecto inválido" });
    }

    const reportes = await Reporte.find({ proyectoId })
      .populate("proyectoId")
      .populate("leidoPor");

    res.json(reportes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener reportes por proyecto" });
  }
});

// Obtener reporte por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de reporte inválido" });
    }

    const reporte = await Reporte.findById(id)
      .populate("proyectoId")
      .populate("leidoPor");

    if (!reporte) {
      return res.status(404).json({ message: "Reporte no encontrado" });
    }

    res.json(reporte);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener reporte" });
  }
});

// Crear nuevo reporte (jefe)
router.post("/", async (req, res) => {
  try {
    const {
      categoria,
      importancia,
      descripcion,
      usuario,
      proyectoId,
      imagenes,
      fecha,
    } = req.body;

    if (!categoria || !importancia || !descripcion || !usuario || !proyectoId) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    if (!mongoose.Types.ObjectId.isValid(proyectoId)) {
      return res.status(400).json({ message: "ID de proyecto inválido" });
    }

    const nuevoReporte = new Reporte({
      categoria,
      importancia,
      descripcion,
      usuario,
      proyectoId,
      imagenes: imagenes || [],
      comentarioAdmin: "",
      comentarioLeido: false,
      notificacion: false,
      leidoPor: [],
      fecha: fecha ? new Date(fecha) : new Date(),
    });

    await nuevoReporte.save();
    res.status(201).json(nuevoReporte);
  } catch (error) {
    res.status(500).json({ message: "Error al guardar reporte" });
  }
});

// Actualizar reporte (admin)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de reporte inválido" });
    }

    const dataActualizar = { ...req.body };

    if (dataActualizar.comentarioAdmin !== undefined) {
      dataActualizar.comentarioLeido = false;
      dataActualizar.leidoPor = [];
      dataActualizar.notificacion = true;
    }

    const reporteActualizado = await Reporte.findByIdAndUpdate(id, dataActualizar, {
      new: true,
    });

    if (!reporteActualizado) {
      return res.status(404).json({ message: "Reporte no encontrado" });
    }

    res.json(reporteActualizado);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar reporte" });
  }
});

// Marcar comentario como leído (solo jefe de cuadrilla del proyecto)
router.put("/:id/comentario-leido", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de reporte inválido" });
    }

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "ID de usuario inválido o faltante" });
    }

    const reporte = await Reporte.findById(id);
    if (!reporte) {
      return res.status(404).json({ message: "Reporte no encontrado" });
    }

    const proyecto = await Proyecto.findById(reporte.proyectoId);
    if (!proyecto) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    // Validación para múltiples jefes de cuadrilla:
    if (
      !proyecto.jefesCuadrillaIds ||
      !proyecto.jefesCuadrillaIds.some(jefeId => jefeId.toString() === userId)
    ) {
      return res.status(403).json({ message: "No tienes permiso para marcar como leído este comentario" });
    }

    if (!reporte.leidoPor.includes(userId)) {
      reporte.leidoPor.push(userId);
    }

    reporte.comentarioLeido = true;
    reporte.notificacion = false;

    await reporte.save();

    const reporteActualizado = await Reporte.findById(id)
      .populate("proyectoId")
      .populate("leidoPor");

    res.json({ message: "Comentario marcado como leído", reporte: reporteActualizado });
  } catch (error) {
    res.status(500).json({ message: "Error al marcar comentario como leído" });
  }
});

// Eliminar reporte
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de reporte inválido" });
    }

    const eliminado = await Reporte.findByIdAndDelete(id);
    if (!eliminado) {
      return res.status(404).json({ message: "Reporte no encontrado" });
    }

    res.json({ message: "Reporte eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar reporte" });
  }
});

export default router;
