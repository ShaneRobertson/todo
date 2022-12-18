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

const db_getUser = async (username, db_password) => {
  console.log("username in db: ", username);
  try {
    const {
      rows: [row],
    } = await client.query(
      `
      SELECT * FROM users
      WHERE username=$1
    `,
      [username]
    );
    console.log("result in the db: ", row);
    if (db_password != row.password) return;

    return row;
  } catch (err) {
    console.log("Error in db_getUser: ", err);
  }
};

const db_createTodo = async ({ title, due_date, user_id }) => {
  try {
    const { rows } = await client.query(
      `
        INSERT INTO todos(title,  due_date,  user_id)
        VALUES ($1, $2, $3) RETURNING *;
        `,
      [title, due_date, user_id]
    );
    console.log(rows);
  } catch (err) {
    console.log("db_createTodo err: ", err);
  }
};

// ============== Get todos ================

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

// const db_getTodo = async (todo_id) =>{
//   try{
//     const {rows} = await client.query(`
//       SELECT
//       `)

//   } catch (err){
//     console.log('db_getTodo error: ', err)
//   }
// }

// ============= Delete Todos ==============
const db_deleteTodo = async (todo_id) => {
  try {
    const { rows } = await client.query(
      `
      DELETE FROM todos
      WHERE todo_id=$1
      RETURNING *;
    `,
      [todo_id]
    );
    return rows;
  } catch (err) {
    console.log("error in db_deleteTodo: ", err);
  }
};

// ============== Update Todo ==========================

const db_updateTodo = async (todo_id, fields = {}) => {
  console.log("db_updateTodo is_complete fields: ", fields);
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
  console.log("this is the setString: ", setString);
  // update todo table
  try {
    // update any fields that need to be updated
    if (setString.length > 0) {
      const { rows } = await client.query(
        `
          UPDATE todos
          SET ${setString}
          WHERE todo_id=${todo_id}
          RETURNING *;
        `,
        Object.values(fields)
      );
      console.log("rows after update in DB: ", rows);
      return rows;
    }
  } catch (error) {
    throw error;
  }
};
module.exports = {
  client,
  db_createUser,
  db_createTodo,
  db_getTodos,
  db_deleteTodo,
  db_updateTodo,
  db_getUser,
};
