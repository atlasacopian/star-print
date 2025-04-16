// index.js

const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = process.env.PORT || 10000;

const queueFile = path.join(__dirname, "jobQueue.json");

app.use(express.json());

// Respond to both GET and POST from printer
app.all("/", (req, res) => {
  console.log("📬 Printer requested job");
  console.log("Headers:", req.headers);
  console.log("Query:", req.query);

  const jobs = JSON.parse(fs.readFileSync(queueFile));

  if (jobs.length === 0) {
    console.log("❌ No jobs available");
    return res.json({ jobReady: false });
  }

  const job = jobs.shift();
  fs.writeFileSync(queueFile, JSON.stringify(jobs, null, 2));

  console.log("✅ Sending job to printer");

  res.set("Content-Type", "application/json");
  res.json({
    jobReady: true,
    mediaTypes: ["receipt"],
    job: {
      format: "starprnt",
      data: job.data
    }
  });
});

// Add a print job
app.post("/add", (req, res) => {
  const { message } = req.body;

  if (!message) return res.status(400).json({ error: "Missing message" });

  const commands = Buffer.from([
    0x1b, 0x40, // Initialize
    ...Buffer.from(message + "\n"),
    0x1b, 0x64, 0x02, // Feed 2 lines
    0x1b, 0x69 // Full cut
  ]);

  const base64Data = commands.toString("base64");

  const jobs = JSON.parse(fs.readFileSync(queueFile));
  jobs.push({ data: base64Data });
  fs.writeFileSync(queueFile, JSON.stringify(jobs, null, 2));

  console.log(`🆕 Job added: ${message}`);
  res.json({ status: "Job added" });
});

app.listen(port, () => {
  console.log(`🚀 Star Print SDK server running on port ${port}`);
});
