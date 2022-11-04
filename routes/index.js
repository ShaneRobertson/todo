const apiRouter = require("express").Router();
const { db_getTodos, db_deleteTodo } = require("../db/index");

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

apiRouter.post("/todos", async (req, res) => {
  let { user_id } = req.body;
  console.log("user id is: ", user_id);
  try {
    const todoList = await db_getTodos(user_id);
    console.log("Routes todolist is: ", todoList);
    res.send(todoList);
  } catch (err) {
    console.log("apiRouter - /todos route", err);
  }
});

apiRouter.delete("/todo/delete", async (req, res) => {
  console.log("in delete route req.body: ", req.body);
  try {
    const { todo_id } = req.body;
    const result = await db_deleteTodo(todo_id);
    console.log("result is: ", result);
    res.send(`todo_id ${todo_id} has been deleted`);
  } catch (err) {
    console.log("error in /todo/delete: ", err);
  }
});

module.exports = { apiRouter };
