import express from "express";
import { Usuario } from "../models/Usuario.js";
import bcrypt from "bcrypt";

const router = express.Router();

// Registrar usuario con todos los campos y password hash
router.post("/registrar", async (req, res) => {
  try {
    const {
      nombre,
      primerApellido,
      segundoApellido,
      email,
      password,
      rol,
      proyectoId,
    } = req.body;

    // Validaciones básicas
    if (!nombre || !primerApellido || !email || !password || !rol) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    // Validar proyecto solo si el rol es jefe de cuadrilla
    if (rol === "jefe_cuadrilla" && !proyectoId) {
      return res
        .status(400)
        .json({ message: "El proyecto es obligatorio para Jefe de Cuadrilla" });
    }

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const nuevoUsuario = new Usuario({
      nombre,
      primerApellido,
      segundoApellido,
      email,
      password: passwordHash,
      rol,
      ...(proyectoId && { proyectoId }),
    });

    await nuevoUsuario.save();

    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ message: "Error al registrar usuario", error });
  }
});

// Obtener lista de usuarios sin password, con proyecto poblado
router.get("/", async (req, res) => {
  try {
    const usuarios = await Usuario.find({}, { password: 0 }).populate("proyectoId", "nombre");
    res.json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios", error });
  }
});

// Actualizar usuario por ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      primerApellido,
      segundoApellido,
      email,
      password,
      rol,
      proyectoId,
    } = req.body;

    if (!nombre || !primerApellido || !email || !rol) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    if (rol === "jefe_cuadrilla" && !proyectoId) {
      return res.status(400).json({
        message: "El proyecto es obligatorio para Jefe de Cuadrilla",
      });
    }

    const actualizarDatos = {
      nombre,
      primerApellido,
      segundoApellido,
      email,
      rol,
      proyectoId: rol === "admin" ? null : proyectoId,
    };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      actualizarDatos.password = passwordHash;
    }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      id,
      actualizarDatos,
      { new: true }
    );

    if (!usuarioActualizado) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario actualizado correctamente", usuarioActualizado });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error al actualizar usuario", error });
  }
});

// Eliminar usuario por ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Usuario.findByIdAndDelete(id);

    if (!eliminado) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ message: "Error al eliminar usuario", error });
  }
});

export default router;
