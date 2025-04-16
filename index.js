// index.js

const express = require("express");
const app = express();
const port = process.env.PORT || 10000;

app.use(express.json());

app.get("/", (req, res) => {
  const receipt = `<?xml version=\"1.0\" encoding=\"UTF-8\"?>
<StarPrint>
  <text>Hello from Atlas\n</text>
  <text>Printed using Star SDK\n</text>
  <cut type=\"partial\" />
</StarPrint>`;

  res.set("Content-Type", "application/xml");
  res.send(receipt);
});

app.listen(port, () => {
  console.log(`Star Print server running on port ${port}`);
});
