const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.post("/salva", (req, res) => {
    const { name, euro } = req.body;
    fs.appendFileSync("dati.txt", `${name};${euro}\n`);
});

app.listen(3000, () => console.log("Server in ascolto su http://localhost:5500"));
