const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("frontend/dist"));
mongoose.connect(
  "mongodb://dashboarddb:linknlink123@192.168.115.11:27017/dashboarddb"
);

const GenericSchema = new mongoose.Schema({}, { strict: false });

let dataSources = [
  {
    id: "mongo_sample",
    label: "MongoDB Sample",
    type: "mongodb",
    collection: "sampledata",
  },
];

// SPA fallback：所有未知路由返回 index.html
app.get("*", (req, res) => {
  res.sendFile(__dirname + "/frontend/dist/index.html");
});

app.get("/data/:collection", async (req, res) => {
  const collectionName = req.params.collection;
  try {
    const Model = mongoose.model(collectionName, GenericSchema, collectionName);
    const docs = await Model.find({}).lean();
    res.json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/data-sources", (req, res) => res.json(dataSources));

app.post("/api/data-sources", (req, res) => {
  const ds = req.body;
  dataSources.push(ds);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
