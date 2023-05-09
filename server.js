const app = require("./app");
const DB = "mongodb+srv://bastpoy:bastien69@cluster0.5ryw1sc.mongodb.net/test";
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const https = require("https");

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

// const sslServer = https.createServer(
//   {
//     key: fs.readFileSync(path.join(__dirname, "cert", "key.pem")),
//     cert: fs.readFileSync(path.join(__dirname, "cert", "cert.pem")),
//   },
//   app
// );

// sslServer.listen(port, () => {
//   console.log(`app running on port ${port}`);
// });
