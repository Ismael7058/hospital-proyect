const express = require("express")
const app = express()

app.set("port", process.env.PORT || 3030);


app.get("/", (req, res) => {
  res.sendFile("index.html", "./view"); 
});


module.exports = app

