const express = require("express");
const mysql = require("mysql");
const WebSocket = require("ws");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "crud",
});

connection.connect();

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

app.get("/", (req, res) => {
  connection.query("SELECT * FROM student", (error, result) => {
    if (error) throw error;
    res.json(result);
  });
});

app.post("/student", (req, res) => {
  const sql = "INSERT INTO student (`Name`, `Email`) VALUES (?, ?)";
  const values = [req.body.name, req.body.email];
  connection.query(sql, values, (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(201).json(result);
    broadcastData();
  });
});

app.get("/read/:id", (req, res) => {
  const sql = "SELECT * FROM student WHERE ID = ?";
  const { id } = req.params;

  connection.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ Message: "Error inside server" });
    res.json(result);
  });
});

app.put("/update/:id", (req, res) => {
  const sql = "UPDATE student SET `Name` =?, `Email`=? WHERE ID=?";
  const { id } = req.params;
  const { name, email } = req.body;

  connection.query(sql, [name, email, id], (err, result) => {
    if (err) return res.status(500).json({ Message: "Error inside server" });
    res.json(result);
    broadcastData();
  });
});

app.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM student WHERE ID = ?";

  connection.query(sql, [id], (error) => {
    if (error) return res.status(500).json({ Message: "Error inside server" });
    res.sendStatus(200);
    broadcastData();
  });
});

const broadcastData = () => {
  connection.query("SELECT * FROM student", (error, result) => {
    if (error) throw error;
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(result));
      }
    });
  });
};

setInterval(broadcastData, 1000);

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
