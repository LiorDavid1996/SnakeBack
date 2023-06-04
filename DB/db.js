
const mongoose = require("mongoose");

mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
  })
  .then(() => console.log("database connected successfully"))
  .catch((err) => console.log("error connecting to mongodb",err));

