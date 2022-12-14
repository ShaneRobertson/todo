const apiRouter = require("express").Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const {
  db_getTodos,
  db_deleteTodo,
  db_updateTodo,
  db_getUser,
} = require("../db/index");

apiRouter.get("/", (req, res) => {
  res.send("hello there!");
});

function verifyToken(req, res, next) {
  const bearerToken = req.headers["authorization"].split(" ")[1];
  console.log("🔴", bearerToken);

  if (bearerToken == "null") {
    console.log("no token.....");
    res.sendStatus(403);
    next();
  } else {
    req.token = bearerToken;
    next();
  }
}

apiRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("username in routes: ", username);
  try {
    const response = await db_getUser(username, password);
    if (!response)
      res.send({ message: "Username or password invalid. Please try again." });
    let verifiedUser = {};
    for (const key in response) {
      if (key != "password") {
        verifiedUser[key] = response[key];
      }
    }
    jwt.sign({ verifiedUser }, process.env.jwt_Secret, (err, token) => {
      if (err) res.send({ err, status: 403 });
      res.send({ verifiedUser, token });
    });
  } catch (error) {
    console.log("/login in routes: ", error.message);
  }
});

apiRouter.patch("/todo", verifyToken, async (req, res) => {
  const { todoId } = req.body;
  if (!req.token) {
    res.send("Hmmmmm I think you might be lost..");
  }
});

apiRouter.post("/todos", verifyToken, async (req, res) => {
  let { user_id } = req.body;

  if (!req.token) {
    res.send("Hmmmmm I think you might be lost..");
  }
  try {
    const todoList = await db_getTodos(user_id);
    console.log("Routes todolist is: ", todoList);
    res.send(todoList);
  } catch (err) {
    console.log("apiRouter - /todos route", err);
  }
});

apiRouter.delete("/delete", verifyToken, async (req, res) => {
  console.log("in delete route req.body: ", req.body);
  try {
    const { todo_id } = req.body;
    const result = await db_deleteTodo(todo_id);
    console.log("result is: ", result);
    res.json(`todo_id ${todo_id} has been deleted`);
  } catch (err) {
    console.log("error in /todo/delete: ", err);
  }
});

apiRouter.patch("/update", verifyToken, async (req, res) => {
  try {
    const updateFields = {};
    const { todo_id, title, due_date } = req.body;

    if (title) {
      updateFields.title = title;
    }
    if (due_date) {
      updateFields.due_date = due_date;
    }

    const updatedTodo = await db_updateTodo(todo_id, updateFields);

    console.log("updated todo in Routes: ", updatedTodo);
    res.send(updatedTodo);
  } catch (err) {
    console.log("Update Todo error in Routes: ", err);
  }
});

apiRouter.patch("/complete", async (req, res) => {
  try {
    const { todo_id } = req.body;
    console.log("todo_id in routes: ", todo_id);
    const result = await db_updateTodo(todo_id, { is_complete: true });
    res.send(result);
    console.log("result in complete route: ", result);
  } catch (err) {
    console.log("complete todo in Routes error: ", err);
  }
});
module.exports = { apiRouter };
