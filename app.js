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
    console.log(results); // results contains rows returned by server
    //console.log(fields); // fields contains extra meta data about results, if available
    res.json(results);
  });
});

app.post("/", function (req, res) {
  connection.execute(
    "INSERT INTO `todotest1` VALUES(?,?)",
    [req.body.id, req.body.tarea],
    (err, results, fields) => {
      console.log("resultados:", results, results.insertId);
      //res.json(results);
      res.status(200).send("listo!");
    }
  );
});

app.put("/", function (req, res) {
  connection.execute(
    "UPDATE `todotest1` SET id = ?, tarea = ? WHERE id = ?",
    [req.body.id, req.body.tarea, req.body.id],
    (err, results, fields) => {
      console.log("resultados:", results, results.insertId);
      //res.json(results);
      res.status(200).send("listo!");
    }
  );
});

app.delete("/del/:Id", function (req, res) {
  //console.log(req.body);
  connection.execute(
    "DELETE FROM `todotest1` WHERE id = ?",
    [req.params.Id],
    (err, results, fields) => {
      console.log("resultados:", results, err, fields);
      //res.json(results);
      res.status(200).send("listo!");
    }
  );
});

app.get("/api", function (req, res) {
  res.json({ bla: "api" });
});

app.use(function (req, res) {
  res.status(404).json({ error: "error 404" });
});

app.listen(3001, function () {
  console.log("app started.");
});
