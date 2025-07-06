import mongoose from "mongoose";

const reporteSchema = new mongoose.Schema({
  categoria: { type: String, required: true },
  importancia: { type: String, required: true },
  fecha: { type: Date, required: true },
  usuario: { type: String, required: true },
  descripcion: { type: String, required: true },
  imagenes: [
    {
      uri: String,
      coordenadas: String
    }
  ],
  proyectoId: { type: mongoose.Schema.Types.ObjectId, ref: "Proyecto", required: true },
});

const Reporte = mongoose.model("Reporte", reporteSchema);
export default Reporte;
