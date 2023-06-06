const app = require("./app");
const DB = "mongodb+srv://bastpoy:bastien69@cluster0.5ryw1sc.mongodb.net/test";
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const port = process.env.PORT;
mongoose.set("strictQuery", false);

mongoose // ici je me connecte a ma base de donnée en utilisant l'url stockée dans DB
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DBconnection successfull");
  });

// lancement du serveur express
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
