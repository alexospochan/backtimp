import mongoose from "mongoose";

const reporteSchema = new mongoose.Schema({
  categoria: { type: String, required: true },
  importancia: { type: String, required: true },
  fecha: { type: Date, required: true, default: Date.now },
  usuario: { type: String, required: true },
  descripcion: { type: String, required: true },
  imagenes: [
    {
      uri: String,
      coordenadas: String,
    },
  ],
  comentarioAdmin: { type: String, default: "" },       // Comentario enviado por admin
  notificacion: { type: Boolean, default: false },      // Si hay notificación de nuevo comentario
  comentarioLeido: { type: Boolean, default: false },   // Si el jefe lo leyó
  proyectoId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  leidoPor: [{ type: mongoose.Schema.Types.ObjectId, ref: "Usuario" }],  // Usuarios que leyeron comentario
});

const Reporte = mongoose.model("Reporte", reporteSchema);
export default Reporte;
