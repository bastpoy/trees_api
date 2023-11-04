const Position = require("../model/positionModel");
const User = require("../model/userModel");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

// const environment = process.env.NODE_ENV || "development";
// const apiUrl =
//   environment === "production"
//     ? process.env.PRODUCTION_API_URL
//     : process.env.DEVELOPMENT_API_URL;
// console.log(apiUrl);
exports.userPage = async (req, res, next) => {
  // il faut que je récupère l'id de mon utilisateur actuelle qui est connecté comme ca je peux avoir accès aux points
  //et je garde seulement les latitudes et longitudes
  try {
    const rankTrees = await res.locals.topThreeObject;
    const myPosition = await Position.find({ user: req.user._id }).select(
      "-user -__v"
    );
    //je récupère mon User aussi
    const myUser = await User.findById(req.user._id).select("-_id -__v");
    //si je suis admin je recoie toutes les autres positions
    const otherPosition = await Position.find({
      user: { $not: { $eq: req.user._id } },
    }).select("-user -__v");

    //je render mon ejs avec les paramètres de position et aussi d'user
    res.status(200).render("user", {
      myPosition: myPosition,
      myUser: myUser,
      otherPosition: otherPosition,
      rankTrees: rankTrees,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(404).json({
      message: "no positions found for this user",
    });
  }
};
exports.loginPage = (req, res, next) => {
  try {
    res.render("login");
  } catch (err) {
    console.log(err);
  }
};
exports.mapPage = async (req, res, next) => {
  try {
    res.status(200).render("map");
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: "error with the loading of map",
    });
  }
};
exports.contributionPage = (req, res, next) => {
  try {
    res.status(200).render("contribution");
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      message: "error with the loading of map",
    });
  }
};
exports.signupPage = async (req, res, next) => {
  //je renvois mon formulaire de signupPage
  console.log(" dans ma page signup");
  try {
    res.status(200).render("signup");
  } catch (err) {
    return res.status(404).json({
      message: "no positions found for this user",
    });
  }
};
