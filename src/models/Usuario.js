import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String },
  primerApellido: { type: String },
  segundoApellido: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: {
    type: String,
    enum: ["admin", "jefe", "jefe_cuadrilla"],
    default: "jefe_cuadrilla", // puedes cambiar el default si quieres
  },
  proyectoId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
});

export const Usuario = mongoose.model("Usuario", usuarioSchema);
