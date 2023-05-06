import express from "express";
import bodyParser from "body-parser";
import { createConnection } from "mysql2";
import dotenv from "dotenv";

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

dotenv.config();
const connection = createConnection(process.env.DATABASE_URL);
console.log("Connected to PlanetScale!");

app.get("/", function (req, res) {
  connection.execute("SELECT * FROM `todotest1`", (err, results, fields) => {
    //console.log(fields); // fields contains extra meta data about results, if available
    if (!err) {
      res.status(200).json(results);
    } else {
      console.error(err); // results contains rows returned by server
      res.status(400).send(err);
    }
  });
});

app.post("/", function (req, res) {
  connection.execute(
    "INSERT INTO `todotest1` VALUES(?,?)",
    [req.body.id, req.body.tarea],
    (err, results, fields) => {
      if (!err) {
        console.log("resultados:", results, results.insertId);

        //?FIXME: tengo que devolver el insertId?
        //? conviene que el Id sea autoinc o mejor generar uno propio y ya saberlo?

        res.status(201).send("listo!");
      } else {
        res.status(400).send(err);
      }
    }
  );
});

app.put("/", function (req, res) {
  connection.execute(
    "UPDATE `todotest1` SET id = ?, tarea = ? WHERE id = ?",
    [req.body.id, req.body.tarea, req.body.id],
    (err, results, fields) => {
      if (!err) {
        console.log("resultados:", results, results.affectedRows);

        //? FIXME: si affectedRows es cero (como cuando se pasa mal el Id)
        //? debería devolver error? devolver ese valor?

        res.status(201).send("listo!");
      } else {
        res.status(400).send(err);
      }
    }
  );
});

app.delete("/del/:Id", function (req, res) {
  connection.execute(
    "DELETE FROM `todotest1` WHERE id = ?",
    [req.params.Id],
    (err, results, fields) => {
      if (!err) {
        console.log("resultados:", results, err, fields);
        res.status(204).send("listo!");
      } else {
        res.status(400).send(err);
      }
    }
  );
});

app.use(function (req, res) {
  res.status(404).json({ error: "error 404" });
});

app.listen(3001, function () {
  console.log("app started.");
});
