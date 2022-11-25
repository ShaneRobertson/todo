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

apiRouter.post("/todos", verifyToken, async (req, res) => {
  let { user_id } = req.body;
  console.log("req.body does have token? ", req.token);
  console.log("headers??????: ", req.headers);
  console.log("user id is: ", user_id);

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

apiRouter.delete("/delete", async (req, res) => {
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

apiRouter.patch("/update", async (req, res) => {
  try {
    const updateFields = {};
    const { todo_id, title, description, due_date } = req.body;

    if (title) {
      updateFields.title = title;
    }
    if (description) {
      updateFields.description = description;
    }
    if (due_date) {
      updateFields.due_date = due_date;
    }
    if (is_complete) {
      updateFields.is_complete = is_complete;
    }

    const result = await updateTodo(todo_id, updateFields);
    const updatedTodo = result.json();
    console.log("updated todo in Routes: ", updatedTodo);
    res.send(updatedTodo);
  } catch (err) {
    console.log("update todo in Routes: ", err);
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
