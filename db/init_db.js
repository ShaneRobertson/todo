const { client, db_createTodo, db_createCustomer } = require("./index.js");

async function buildDB() {
  try {
    client.connect();
    console.log("Dropping Tables...");

    await client.query(`
    DROP TABLE IF EXISTS todos CASCADE;
    DROP TABLE IF EXISTS customers CASCADE;
    DROP TABLE IF EXISTS customers_todos;
    `);

    console.log(`Building tables...`);
    console.log("customers...");

    await client.query(`
    CREATE TABLE customers (
        customer_id SERIAL PRIMARY KEY,
        username VARCHAR(75) NOT NULL UNIQUE,
        password VARCHAR(250) NOT NULL
    );

`);

    console.log(`todos...`);
    await client.query(`
            CREATE TABLE todos (
                todo_id SERIAL PRIMARY KEY,
                title VARCHAR(75) NOT NULL,
                description VARCHAR(250),
                due_date DATE NOT NULL,
                is_complete BOOLEAN DEFAULT FALSE,
                customer_id INT REFERENCES customers(customer_id)
            );
        `);

    console.log("customer_todo..");
    await client.query(`
              CREATE TABLE customers_todos(
                customer_id INT UNIQUE,
                todo_id INT
              );
    `);

    console.log("Finished creating tables...");
  } catch (err) {
    console.log("buildDB error: ", err);
  }
}

// Sample Data =================
let newTodo1 = {
  title: "Take out the garbage",
  description: "This is todo1s description",
  due_date: "2022-11-15",
  customer_id: 1,
};

let newTodo2 = {
  title: "Study React",
  description: "This is todo2s description",
  due_date: "2021-07-02",
  customer_id: 1,
};

let newTodo3 = {
  title: "Follow Noahs advice",
  description: "This is todo3s description",
  due_date: "2022-12-3",
  customer_id: 1,
};

let newTodo4 = {
  title: "type this title",
  description: "This is todo4s description",
  due_date: "2023-12-31",
  customer_id: 1,
};

let newTodo5 = {
  title: "Find a new house",
  description: "This is todo5s description",
  due_date: "2022-05-22",
  customer_id: 1,
};

let newTodo6 = {
  title: "Save Hyrule from Gananondorf",
  description: "This is todo6s description",
  due_date: "2022-08-01",
  customer_id: 1,
};

let customer1 = {
  username: "zelda",
  password: "Hyrule",
};
// =============================

async function populateInitialData() {
  try {
    await db_createCustomer(customer1);
    await db_createTodo(newTodo1);
    await db_createTodo(newTodo2);
    await db_createTodo(newTodo3);
    // await db_createTodo(newTodo4);
    // await db_createTodo(newTodo5);
    // await db_createTodo(newTodo6);
  } catch (err) {
    console.log("err in populateInitialData: ", err);
  }
}

buildDB()
  .then(populateInitialData)
  .catch(console.error)
  .finally(() => client.end());
