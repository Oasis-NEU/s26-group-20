const express = require("express"); // import Express
const app = express(); // set up our Express app instance
const port = 8000; // set the port for our API to run on

app.get("/", (req, res) => { // create a GET endpoint at `/`
  res.send("Hello World!"); // return value of the endpoint
});

app.listen(port, () => { // listen for the port specified above
  console.log(`API listening on port ${port}`); // print a success message to the terminal
});
