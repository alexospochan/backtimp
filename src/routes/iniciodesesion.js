import express from "express";
import { Usuario } from "../models/Usuario.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  console.log("Intento login:", email, "Password recibido:", password);

  if (!email || !password) {
    return res.status(400).json({ message: "Email y password son obligatorios" });
  }

  try {
    const usuario = await Usuario.findOne({ email }).populate("proyectoId", "nombre");

    if (!usuario) {
      console.log("Correo no encontrado");
      return res.status(401).json({ message: "Correo no encontrado" });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);
    console.log("Password válido:", passwordValido);

    if (!passwordValido) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Verificación de rol
    console.log("Usuario encontrado:", usuario);
    console.log("Rol devuelto:", usuario.rol);

    res.status(200).json({
      message: "Login exitoso",
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre || "",
        primerApellido: usuario.primerApellido || "",
        segundoApellido: usuario.segundoApellido || "",
        email: usuario.email,
        rol: usuario.rol || "",
        proyecto: usuario.proyectoId || null,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

export default router;  
