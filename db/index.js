require("dotenv").config();
const { Client } = require("pg");
const { DB_NAME } = process.env;
const DB_URL = process.env.DATABASE_URL || `postgressql://${DB_NAME}`;
const client = new Client(DB_URL);

// Seeding the database ==========
const db_createCustomer = async ({ username, password }) => {
  "";
  try {
    await client.query(
      `
            INSERT INTO customers(username, password)
            VALUES ($1, $2)
            `,
      [username, password]
    );
  } catch (err) {
    console.log("error in db_createCustomer: ", err);
  }
};
const db_createTodo = async ({ title, description, due_date, customer_id }) => {
  try {
    await client.query(
      `
        INSERT INTO todos(title, description, due_date,  customer_id)
        VALUES ($1, $2, $3, $4) 
        `,
      [title, description, due_date, customer_id]
    );
  } catch (err) {
    console.log("db_createTodo err: ", err);
  }
};

// Getting the todos ================

const getTodos = async () => {
  try {
    const { rows } = await client.query(`
      SELECT * FROM todos;
    `);
    console.log("result is: ", rows);
    return rows;
  } catch (err) {
    console.log("getTodos: ", err);
  }
};

module.exports = { client, db_createCustomer, db_createTodo, getTodos };
