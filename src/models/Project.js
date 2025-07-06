import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  kmInicio: { type: Number, required: true },
  kmFinal: { type: Number, required: true },
  manager: { type: String, required: true },
  ciudadInicio: { type: String, required: true },
  ciudadFinal: { type: String, required: true },
  descripcion: { type: String },
  latInicio: { type: Number, required: true },
  lonInicio: { type: Number, required: true },
  latFinal: { type: Number, required: true },
  lonFinal: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Project = mongoose.model("Project", projectSchema);
export default Project;
