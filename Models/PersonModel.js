import mongoose from "mongoose";

const PersonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rollNo: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  request: {
    type: mongoose.Schema.Types.Mixed,
    default: {
      id: { type: String, required: false },
      subject: { type: String, required: true },
      body: { type: String, required: true },
      sender: { type: String, required: true },
      docs: { type: String, required: false },
      status: { type: String, required: false, default: "pending" },
    },
  },
  permissionRequests: {
    type: Array,
    default: [],
  },
  permissionRecords: {
    type: Array,
    default: [],
  },
  classAndSection: {
    type: String,
    required: false,
  },
  designation: {
    type: String,
    required: false,
  },
  coord: {
    type: Boolean,
    required: false,
  },
  classCoord: {
    type: String,
    required: false,
  },
  classCoordYear: {
    type: String,
    required: false,
  },

  receiver: {
    type: String,
    required: false,
  },
});

const person = mongoose.model("Person", PersonSchema);
export default person;
