// generate-job.js

const fs = require("fs");
const path = require("path");

const message = "HELLO from raw binary 💥";
const queuePath = path.join(__dirname, "jobQueue.json");

// Build proper StarPRNT commands
const commands = Buffer.concat([
  Buffer.from([0x1b, 0x40]), // Initialize
  Buffer.from(message + "\n", "ascii"), // Message
  Buffer.from([0x1b, 0x64, 0x02]), // Feed 2 lines
  Buffer.from([0x1b, 0x69]) // Full cut
]);

// Encode as base64
const base64Data = commands.toString("base64");

// Add to queue
let queue = [];
if (fs.existsSync(queuePath)) {
  queue = JSON.parse(fs.readFileSync(queuePath));
}

queue.push({ data: base64Data });
fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2));

console.log("🧾 Job added to queue!");
