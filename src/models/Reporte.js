import mongoose from "mongoose";

const imagenSchema = new mongoose.Schema({
  uri: { type: String, required: true },
  coordenadas: { type: String, default: "" },
}, { _id: false }); // No crea ID automático por cada imagen

const reporteSchema = new mongoose.Schema({
  categoria: { type: String, required: true },
  importancia: { type: String, required: true },
  fecha: { type: Date, default: Date.now, required: true },
  usuario: { type: String, required: true },
  descripcion: { type: String, required: true },
  imagenes: [imagenSchema],  // Array de imágenes con uri y coordenadas
  comentarioAdmin: { type: String, default: "" },       // Comentario enviado por admin
  notificacion: { type: Boolean, default: false },      // Si hay notificación de nuevo comentario
  comentarioLeido: { type: Boolean, default: false },   // Si el jefe ya leyó el comentario
  proyectoId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  leidoPor: [{ type: mongoose.Schema.Types.ObjectId, ref: "Usuario" }],  // Usuarios que leyeron comentario
});

const Reporte = mongoose.model("Reporte", reporteSchema);
export default Reporte;
