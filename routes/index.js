const apiRouter = require("express").Router();

apiRouter.get("/", (req, res) => {
  res.send("hello there!");
});

apiRouter.get("/user", (req, res) => {
  try {
    res.send("in user route");
  } catch (err) {
    console.log(`err is: ${err}`);
  }
});
module.exports = { apiRouter };
