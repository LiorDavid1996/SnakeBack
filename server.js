
const express = require("express");
const cors = require("cors");
const app = express();
const PORT=8080

require('dotenv').config();
require("./DB/db")
app.use(cors());
app.use(express.json({ extended: true })); 
app.use(express.urlencoded({ extended: true }));

const usersRouter = require("./routes/userRoute");


app.use('/api/users',usersRouter)


app.get("/", (req, res) => {
    res.send({ message: "success" })
});
app.listen(PORT, () => {
  console.log(`listen to port: ${PORT}` );
});