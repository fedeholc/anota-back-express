import express from "express";
import bodyParser from "body-parser";
import { createConnection } from "mysql2";
import dotenv from "dotenv";
import cors from "cors";

const PORT = process.env.PORT || 3025;
const TABLE_NAME = "note3";

dotenv.config();

const connection = createConnection(process.env.DATABASE_URL);
console.log("Connected to PlanetScale!");

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// TODO: Poner todos los campos en la consulta SQL
// TODO: pasar la consulta a una variable
app.get("/", function (req, res) {
  connection.execute(`SELECT * FROM ${TABLE_NAME}`, (err, results, fields) => {
    //console.log(fields); // fields contains extra meta data about results, if available
    if (!err) {
      res.status(200).json(results);
    } else {
      console.error(err); // results contains rows returned by server
      res.status(400).send(err);
    }
  });
});

// TODO: Poner todos los campos en la consulta SQL
// TODO: pasar la consulta a una variable
app.post("/", function (req, res) {
  let postQuery = `INSERT INTO ${TABLE_NAME} 
    (id, noteText, noteHTML, noteTitle, tags, category, deleted, archived, reminder, rating, created, modified) 
    VALUES (
      '${req.body.id}', 
      '${req.body.noteText}', 
      '${req.body.noteHTML}',
      '${req.body.noteTitle}',
      '${req.body.tags}',
      '${req.body.category}',
      ${req.body.deleted},
      ${req.body.archived},
      '${req.body.reminder}',
      ${req.body.rating},
      '${req.body.created}',
      '${req.body.modified}'
    )`;

  connection.execute(postQuery, (err, results, fields) => {
    if (!err) {
      res.status(201).send("ok1");
    } else {
      res.status(400).send(err);
    }
  });
});

// TODO: Poner todos los campos en la consulta SQL
// TODO: pasar la consulta a una variable
app.put("/", function (req, res) {
  connection.execute(
    `UPDATE ${TABLE_NAME} SET id = '${req.body.id}', 
    noteText = '${req.body.noteText}', 
    noteHTML = '${req.body.noteHTML}', 
    noteTitle = '${req.body.noteTitle}',
    tags = '${req.body.tags}',
    category = '${req.body.category}',
    deleted = ${req.body.deleted},
    archived = ${req.body.archived},
    reminder = '${req.body.reminder}',
    rating = ${req.body.rating},
    created = '${req.body.created}',
    modified = '${req.body.modified}'
    WHERE id = '${req.body.id}'`,

    (err, results, fields) => {
      if (!err) {
        console.log("resultados:", results, results.affectedRows);

        //? FIXME: si affectedRows es cero (como cuando se pasa mal el Id)
        //? debería devolver error? devolver ese valor?

        res.status(201).send("OK");
      } else {
        res.status(400).send(err);
      }
    }
  );
});

// TODO: pasar la consulta a una variable
app.delete("/del/:Id", function (req, res) {
  connection.execute(
    `DELETE FROM ${TABLE_NAME} WHERE id = ?`,
    [req.params.Id],
    (err, results, fields) => {
      if (!err) {
        console.log("resultados:", results, err, fields);
        res.status(204).send("OK");
      } else {
        res.status(400).send(err);
      }
    }
  );
});

app.use(function (req, res) {
  res.status(404).send("error 404");
});

app.listen(PORT, function () {
  console.log("app started.");
});

/* http.createServer(app).listen(3001, function () {
  console.log("Guestbook app started.");
});
 */
