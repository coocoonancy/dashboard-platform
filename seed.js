const mongoose = require("mongoose");

mongoose.connect(
  "mongodb://dashboarddb:linknlink123@192.168.115.11:27017/dashboarddb"
);

const SampleSchema = new mongoose.Schema(
  {
    label: String,
    value: Number,
  },
  { collection: "sampledata" }
);

const Sample = mongoose.model("Sample", SampleSchema);

async function run() {
  await Sample.deleteMany({});
  await Sample.insertMany([
    { label: "A", value: 5 },
    { label: "B", value: 3 },
    { label: "C", value: 8 },
    { label: "D", value: 6 },
  ]);
  console.log("Data seeded");
  mongoose.disconnect();
}

run();
