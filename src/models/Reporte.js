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
  comentario: { type: String, default: "" },
  notificacion: { type: Boolean, default: false },
  comentarioLeido: { type: Boolean, default: false },

  proyectoId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },


  leidoPor: [{ type: mongoose.Schema.Types.ObjectId, ref: "Usuario" }],
});

const Reporte = mongoose.model("Reporte", reporteSchema);
export default Reporte;
