const express = require("express");
const morgan = require("morgan");
const server = express();
const PORT = process.env.PORT || 3000;
const { apiRouter } = require("./routes");
const { client } = require("./db/index.js");

server.use(morgan("dev"));
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use("/api", apiRouter);

const path = require("path");
server.use(express.static(path.join(__dirname, "public")));

server.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

server.listen(PORT, async () => {
  console.log(`listening on port ${PORT}`);
  try {
    await client.connect();
  } catch (err) {
    console.log(`todo/index.js 21: ${err}`);
  }
});
