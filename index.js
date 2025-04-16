// index.js

const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = process.env.PORT || 10000;

const queueFile = path.join(__dirname, "jobQueue.json");

app.use(express.json());

// Serve the next available print job
app.get("/", (req, res) => {
  const jobs = JSON.parse(fs.readFileSync(queueFile));

  if (jobs.length === 0) {
    return res.json({ jobReady: false });
  }

  const job = jobs.shift();
  fs.writeFileSync(queueFile, JSON.stringify(jobs, null, 2));

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

  const job = Buffer.from(
    `\x1b@${message}\n\x1b\x64\x02\x1b\x69`,
    "binary"
  ).toString("base64");

  const jobs = JSON.parse(fs.readFileSync(queueFile));
  jobs.push({ data: job });
  fs.writeFileSync(queueFile, JSON.stringify(jobs, null, 2));

  res.json({ status: "Job added" });
});

app.listen(port, () => {
  console.log(`Star Print SDK server running on port ${port}`);
});
