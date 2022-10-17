const express = require("express");
const server = express();
const PORT = process.env.PORT || 3000;
const { apiRouter } = require("./routes");

server.use("/api", apiRouter);

const path = require("path");
server.use(express.static(path.join(__dirname, "public")));

server.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

server.listen(PORT, () => {
  try {
    console.log(`listening on port ${PORT}`);
  } catch (err) {
    console.log(`todo/index.js 12: ${err}`);
  }
});
