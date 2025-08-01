import mongoose from "mongoose";

const imagenSchema = new mongoose.Schema({
  uri: { type: String, required: true },
  coordenadas: { type: String, default: "" },
}, { _id: false }); 

const reporteSchema = new mongoose.Schema({
  categoria: { type: String, required: true },
  importancia: { type: String, required: true },
  fecha: { type: Date, default: Date.now, required: true },
  usuario: { type: String, required: true },
  descripcion: { type: String, required: true },
  imagenes: [imagenSchema],  
  comentarioAdmin: { type: String, default: "" },       
  notificacion: { type: Boolean, default: false },      
  comentarioLeido: { type: Boolean, default: false },   
  proyectoId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  leidoPor: [{ type: mongoose.Schema.Types.ObjectId, ref: "Usuario" }],  
});

const Reporte = mongoose.model("Reporte", reporteSchema);
export default Reporte;
