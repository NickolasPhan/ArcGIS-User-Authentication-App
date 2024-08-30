const app = require("https-localhost")();
const port = 8080;

app.serve(__dirname + '/www');

app.listen(port);