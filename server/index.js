const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
const dbo = require("./db/conn"); // Import the connection

app.use(cors());
app.use(express.json());
app.use(require("./routes/player"));

app.use("/", (req, res) => {
  res.send("Server is Running");
});

// Use async/await here
const startServer = async () => {
  try {
    // Connect to the MongoDB server
    await dbo.connectToServer();

    // Start the express app
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  } catch (error) {
    console.error(error);
  }
};

// Call the function to start the server
startServer();
