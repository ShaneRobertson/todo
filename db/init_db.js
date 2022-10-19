require("dotenv").config();

const { Client } = require("pg");
const { KEY, PASSWORD } = process.env;
const DB_NAME = `${KEY}:${PASSWORD}@localhost:5432/todo`;
const DB_URL = process.env.DATABASE_URL || `postgressql://${DB_NAME}`;
const client = new Client(DB_URL);

module.exports = { client };

async function buildDB() {
  try {
    client.connect();
    console.log("Dropping Tables...");
    await client.query(`
    DROP TABLE IF EXISTS expired, upcoming, clients CASCADE;

    `);

    console.log(`Building tables...`);
    console.log(`upcoming...`);

    await client.query(`
            CREATE TABLE upcoming (
                upcoming_id SERIAL PRIMARY KEY,
                title VARCHAR(75) NOT NULL,
                description VARCHAR(250),
                due_date DATE NOT NULL
            );
        `);
    console.log("expired...");
    await client.query(`
            CREATE TABLE expired (
                expired_id SERIAL PRIMARY KEY,
                title VARCHAR(75) NOT NULL,
                description VARCHAR(250),
                due_date DATE NOT NULL
            );

        `);
    console.log("clients...");

    await client.query(`
    CREATE TABLE clients (
        client_id SERIAL PRIMARY KEY,
        username VARCHAR(75) NOT NULL UNIQUE,
        password VARCHAR(250) NOT NULL,
        upcoming_id INT REFERENCES upcoming(upcoming_id),
        expired_id INT REFERENCES expired(expired_id)
    );

`);

    console.log("Finished creating tables...");
  } catch (err) {
    console.log("buildDB error: ", err);
  }
}

// async function populateInitialData() {
//   try {
//     await client.query(`
//         INSERT INTO upcoming(title, description, due_date)
//         VALUES ('upcoming1', 'This is upcoming1s description', '2022-12-31'),
//         ('upcoming2', 'This is upcoming2s description', '2022-11-23');
//         `);
//   } catch (err) {
//     console.log("err in populateInitialData: ", err);
//   }
// }

buildDB()
  .then(console.log("dff"))
  .catch(console.error)
  .finally(() => client.end());
