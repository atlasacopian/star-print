// index.js

const express = require("express");
const app = express();
const port = process.env.PORT || 10000;

app.use(express.json());

// Respond to CloudPRNT polling with a verified working print job
app.all("/", (req, res) => {
  console.log("📬 Printer requested job");

  // ESC @ (init), "HELLO ATLAS\n", ESC d 3 (feed), ESC i (cut)
  const commands = Buffer.concat([
    Buffer.from([0x1b, 0x40]), // Initialize
    Buffer.from("HELLO ATLAS\n", "ascii"),
    Buffer.from([0x1b, 0x64, 0x03]), // Feed 3 lines
    Buffer.from([0x1b, 0x69]) // Full cut
  ]);

  const base64Data = commands.toString("base64");

  res.set("Content-Type", "application/json");
  res.json({
    jobReady: true,
    mediaTypes: ["receipt"],
    job: {
      format: "starprnt",
      data: base64Data
    }
  });

  console.log("✅ Sent CloudPRNT-format job to printer");
});

app.listen(port, () => {
  console.log(`🚀 Star Print CloudPRNT server running on port ${port}`);
});
