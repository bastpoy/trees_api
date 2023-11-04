const express = require("express");
const authController = require("./controller/authController.js");
const positionController = require("./controller/positionController.js");
const viewsController = require("./controller/viewsController.js");
const email = require("./controller/emailController.js");
const payment = require("./controller/paymentController.js");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public", "html"));
app.use(express.static(path.join(__dirname, "public")));

//fonction permettant de limiter le nombre de requêtes sur notre api. on le voit dans le header de la réponsé lenombre de requêtes qu'il reste
const limiter = rateLimit({
  //je convertis mes ms en heure et je veux max 100 request en une heure
  max: 5000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests  from this IP, please try again in an hour!",
});

app.use("/", limiter); // on dit sur quelle route appliquer notre limiter

//security http
// app.use(helmet());
// aul ieu d'utiliser app.use(helmet()) j'utilise le code ci-dessous qui me permet de faire marcher mapbox
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", "blob:", "https://*.mapbox.com"],
      scriptSrc: ["'self'", "https://*.mapbox.com", "'unsafe-inline'", "blob:"],
    },
  })
);
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://api.mapbox.com");
  next();
});
app.use(cors());
app.use(express.json({ limit: "10kb" })); // limiter le body à 10kb
app.use(bodyParser.json());
//ceci permet de récupérer le cookie d'une incoming request
app.use(cookieParser());
//Data sanitization against nosql query injection//voir exemple video 145 2min
//look at request body and filter the malicious operators and code like ${gte} operators from mongoose
app.use(mongoSanitize());
//DATA SANITIZATION AGAINST XSS
app.use(xss());
//prevent parameter pollution
app.use(hpp()); // tout ce qui concerne les filtres genre '?sort=price'
//on peut autoriser des filtres à être dupliquer pour par exemple avoir plusieurs duréees
//genre créer une whitelist

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
app.use(function (req, res, next) {
  var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  // console.log("IP address:", ip);
  next();
});

//routes liées à l'authentification et à l'utilisateur
app.get("/", viewsController.loginPage);
app.post("/signup", authController.signup);
app.post("/login", authController.login);
app.get("/logout", authController.protect, authController.logout);
app.get(
  "/user",
  authController.protect,
  positionController.getTopThreePositions,
  viewsController.userPage
);
app.get("/signupForm", viewsController.signupPage);

//routes liées aux positions
app.get(
  "/positions",
  authController.protect,
  //authController.restrictTo("admin"),
  positionController.getAllPositions
);
app.get(
  "/mypositions",
  authController.protect,
  positionController.getMyPositions
);
app.get(
  "/otherPositions",
  authController.protect,
  positionController.getOtherPositions
);
app.post(
  "/positions",
  authController.protect,
  positionController.createPosition
);
app.delete(
  "/position/:id",
  authController.protect,
  positionController.deletePosition
);

//routes liées a la map
app.get("/map", authController.protect, viewsController.mapPage);
app.get(
  "/contribution",
  authController.protect,
  viewsController.contributionPage
);
app.get("/email:email", email.sendMail);
app.get("/payment", payment.createPayment);
app.get("/getTopThreePositions", positionController.getTopThreePositions);
//j'exporte mon app
module.exports = app;
