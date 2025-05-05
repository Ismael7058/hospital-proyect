const express = require("express")
const app = express()

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.set("port", process.env.PORT || 3030);

app.get('/', (req, res) => {
  res.sendFile(__dirname+ '/view/index.html');
});

app.get('/medico', (req, res) => {
  res.sendFile(__dirname+ '/view/medico/home.html');
});

module.exports = app

