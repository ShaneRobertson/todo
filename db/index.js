require("dotenv").config();
const { Client } = require("pg");
const { DB_NAME } = process.env;
const DB_URL = process.env.DATABASE_URL || `postgressql://${DB_NAME}`;
const client = new Client(DB_URL);

// Seeding the database ==========
const db_createUser = async ({ username, password }) => {
  "";
  try {
    await client.query(
      `
            INSERT INTO users(username, password)
            VALUES ($1, $2)
            `,
      [username, password]
    );
  } catch (err) {
    console.log("error in db_createCustomer: ", err);
  }
};

// const db_createTodoRelation = async (user_id, todo_id) => {
//   try {
//     const { rows } = await client.query(
//       `
//       INSERT INTO users_todos(user_id, todo_id)
//       VALUES($1, $2) RETURNING*;
//     `,
//       [user_id, todo_id]
//     );
//     console.log("relationship: ", rows);
//   } catch (err) {
//     console.log("Error with db_createTodoRelation: ", err);
//   }
// };
const db_createTodo = async ({ title, description, due_date, user_id }) => {
  try {
    // const {
    //   rows: [{ todo_id }],
    // } = await client.query(
    //   `
    //     INSERT INTO todos(title, description, due_date,  user_id)
    //     VALUES ($1, $2, $3, $4) RETURNING *;
    //     `,
    //   [title, description, due_date, user_id]
    // );
    // await db_createTodoRelation(user_id, todo_id);
    const { rows } = await client.query(
      `
        INSERT INTO todos(title, description, due_date,  user_id)
        VALUES ($1, $2, $3, $4) RETURNING *;
        `,
      [title, description, due_date, user_id]
    );
    console.log(rows);
  } catch (err) {
    console.log("db_createTodo err: ", err);
  }
};

// Getting the todos ================

const db_getTodos = async (user_id) => {
  try {
    const { rows } = await client.query(
      `
      SELECT * FROM todos
      WHERE user_id=$1
      ;
    `,
      [user_id]
    );
    console.log("result of get todos: ", rows);
    return rows;
  } catch (err) {
    console.log("getTodos: ", err);
  }
};

// Delete Todos ==============

const db_deleteTodo = async (todo_id) => {
  try {
    await client.query(
      `
      DELETE FROM todos
      WHERE todo_id=$1
    `,
      [todo_id]
    );
  } catch (err) {
    console.log("error in db_deleteTodo: ", err);
  }
};

module.exports = {
  client,
  db_createUser,
  db_createTodo,
  db_getTodos,
  db_deleteTodo,
};
