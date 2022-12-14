const { client, db_createTodo, db_createUser } = require("./index.js");

async function buildDB() {
  try {
    client.connect();
    console.log("Dropping Tables...");

    await client.query(`
    DROP TABLE IF EXISTS todos CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
    DROP TABLE IF EXISTS users_todos;
    `);

    console.log(`Building tables...`);
    console.log("customers...");

    await client.query(`
    CREATE TABLE users (
        user_id SERIAL PRIMARY KEY,
        username VARCHAR(75) NOT NULL UNIQUE,
        password VARCHAR(250) NOT NULL
    );

`);

    console.log(`todos...`);
    await client.query(`
            CREATE TABLE todos (
                todo_id SERIAL PRIMARY KEY,
                title VARCHAR(75) NOT NULL,
                due_date DATE NOT NULL,
                status VARCHAR(25) DEFAULT 'inProgress',
                priority VARCHAR(10) DEFAULT 'high',
                user_id INT REFERENCES users(user_id)
            );
        `);

    console.log("customer_todo..");
    await client.query(`
              CREATE TABLE users_todos(
                user_id INT, 
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
  due_date: "2022-11-15",
  user_id: 1,
};

let newTodo2 = {
  title: "Study React",
  due_date: "2021-07-02",
  user_id: 1,
};

let newTodo3 = {
  title: "Follow Noahs advice",
  due_date: "2022-12-3",
  user_id: 2,
};

let newTodo4 = {
  title: "type this title",
  due_date: "2023-12-31",
  user_id: 2,
};

let newTodo5 = {
  title: "Find a new house",
  due_date: "2021-05-22",
  user_id: 2,
};

let newTodo6 = {
  title: "Save Hyrule from Gananondorf",
  due_date: "2022-08-01",
  user_id: 2,
};

let user1 = {
  username: "zelda",
  password: "hyrule",
};
let user2 = {
  username: "link",
  password: "courage",
};
// =============================

async function populateInitialData() {
  try {
    await db_createUser(user1);
    await db_createUser(user2);
    await db_createTodo(newTodo1);
    await db_createTodo(newTodo2);
    await db_createTodo(newTodo3);
    await db_createTodo(newTodo4);
    await db_createTodo(newTodo5);
    await db_createTodo(newTodo6);
  } catch (err) {
    console.log("err in populateInitialData: ", err);
  }
}

buildDB()
  .then(populateInitialData)
  .catch(console.error)
  .finally(() => client.end());
