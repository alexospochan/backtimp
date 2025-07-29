import express from "express";
import mongoose from "mongoose";
import Reporte from "../models/Reporte.js";

const router = express.Router();

// Obtener todos los reportes (admin)
router.get("/", async (req, res) => {
  try {
    const reportes = await Reporte.find()
      .populate("proyectoId")
      .populate("leidoPor");
    res.json(reportes);
  } catch (error) {
    console.error("Error al obtener reportes:", error);
    res.status(500).json({ message: "Error al obtener reportes" });
  }
});

// Obtener reportes por proyecto (jefe)
router.get("/proyecto/:proyectoId", async (req, res) => {
  try {
    const { proyectoId } = req.params;
    if (!proyectoId || !mongoose.Types.ObjectId.isValid(proyectoId)) {
      return res.status(400).json({ message: "ID de proyecto inválido o faltante" });
    }

    const reportes = await Reporte.find({ proyectoId })
      .populate("proyectoId")
      .populate("leidoPor");

    res.json(reportes);
  } catch (error) {
    console.error("Error al obtener reportes por proyecto:", error);
    res.status(500).json([]);
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
    console.error("Error al obtener reporte:", error);
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
      comentarioAdmin: "",     // Por defecto sin comentario admin
      comentarioLeido: false,
      notificacion: false,
      leidoPor: [],
      fecha: fecha ? new Date(fecha) : new Date(),
    });

    await nuevoReporte.save();
    res.status(201).json(nuevoReporte);
  } catch (error) {
    console.error("Error al guardar reporte:", error);
    res.status(500).json({ message: "Error al guardar reporte" });
  }
});

// Actualizar reporte (admin) — para actualizar comentarioAdmin y otras cosas
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de reporte inválido" });
    }

    const dataActualizar = { ...req.body };

    // Si se actualiza comentarioAdmin, reiniciar flags y leidoPor
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
    console.error("Error al actualizar reporte:", error);
    res.status(500).json({ message: "Error al actualizar reporte" });
  }
});

// Marcar comentario como leído (jefe)
router.put("/:id/comentario-leido", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const reporte = await Reporte.findById(id);
    if (!reporte) {
      return res.status(404).json({ message: "Reporte no encontrado" });
    }

    // Agregar usuario a leidoPor solo si no está
    if (!reporte.leidoPor.some((u) => u.toString() === userId)) {
      reporte.leidoPor.push(userId);
    }

    reporte.comentarioLeido = true;
    reporte.notificacion = false;

    await reporte.save();

    const reporteActualizado = await Reporte.findById(id)
      .populate("proyectoId")
      .populate("leidoPor");

    res.json({
      message: "Comentario marcado como leído",
      reporte: reporteActualizado,
    });
  } catch (error) {
    console.error("Error al marcar comentario como leído:", error);
    res.status(500).json({ message: "Error al marcar comentario como leído" });
  }
});

// Eliminar reporte (admin)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de reporte inválido" });
    }

    const reporteEliminado = await Reporte.findByIdAndDelete(id);

    if (!reporteEliminado) {
      return res.status(404).json({ message: "Reporte no encontrado" });
    }

    res.json({ message: "Reporte eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar reporte:", error);
    res.status(500).json({ message: "Error al eliminar reporte" });
  }
});

export default router;
