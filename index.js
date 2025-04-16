const express = require("express");
const app = express();
const port = process.env.PORT || 10000;

app.use(express.json());

// Serve a known-good hardcoded job
app.all("/", (req, res) => {
  console.log("📬 Printer requested job");

  // ESC @ (init), "HELLO ATLAS\n", ESC d 3 (feed), ESC i (cut)
  const base64Data = "G0AESEVMTE8gQVRMQVMKGrs=";

  res.set("Content-Type", "application/json");
  res.json({
    jobReady: true,
    mediaTypes: ["receipt"],
    job: {
      format: "starprnt",
      data: base64Data
    }
  });

  console.log("✅ Sent hardcoded test job");
});

app.listen(port, () => {
  console.log(`🚀 Star Print SDK server running on port ${port}`);
});
