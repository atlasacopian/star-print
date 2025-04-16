// index.js

const express = require("express");
const app = express();
const port = process.env.PORT || 10000;

app.use(express.json());

// Respond with fully structured CloudPRNT job format
app.all("/", (req, res) => {
  console.log("📬 Printer requested job");

  const commands = Buffer.concat([
    Buffer.from([0x1b, 0x40]), // ESC @ (init)
    Buffer.from("HELLO ATLAS\n", "ascii"),
    Buffer.from([0x1b, 0x64, 0x03]), // ESC d 3 (feed)
    Buffer.from([0x1b, 0x69]) // ESC i (cut)
  ]);

  const base64Data = commands.toString("base64");

  const jobResponse = {
    jobReady: true,
    jobToken: "job-001", // optional but included for completeness
    mediaTypes: ["receipt"],
    job: {
      format: "starprnt",
      formatVersion: "1.0",
      jobName: "Print Hello Atlas",
      data: base64Data
    }
  };

  res.set("Content-Type", "application/json");
  res.status(200).json(jobResponse);

  console.log("✅ Sent full CloudPRNT-format job");
});

app.listen(port, () => {
  console.log(`🚀 Star Print CloudPRNT+JSON server running on port ${port}`);
});
