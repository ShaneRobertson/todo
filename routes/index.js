const apiRouter = require("express").Router();
const { getTodos } = require("../db/index");

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

apiRouter.get("/todos", async (req, res) => {
  try {
    console.log("in the todo route");
    const todoList = await getTodos();
    console.log("todolist is: ", todoList);
    res.send(todoList);
  } catch (err) {
    console.log("apiRouter - /todos route", err);
  }
});

module.exports = { apiRouter };
