const Position = require("../model/positionModel");
const User = require("../model/userModel");

exports.userPage = async (req, res, next) => {
  // il faut que je récupère l'id de mon utilisateur actuelle qui est connecté comme ca je peux avoir accès aux points
  //et je garde seulement les latitudes et longitudes
  try {
    const myPosition = await Position.find({ user: req.user._id }).select(
      "-user -__v"
    );
    //je récupère mon User aussi
    const myUser = await User.findById(req.user._id).select("-_id -__v");
    //si je suis admin je recoie toutes les autres positions
    let otherPosition;
    if (req.user.role === "admin") {
      otherPosition = await Position.find({
        user: { $not: { $eq: req.user._id } },
      }).select("-user -__v");
    }
    //je render mon ejs avec les paramètres de position et aussi d'user
    res.status(200).render("user", {
      myPosition: myPosition,
      myUser: myUser,
      otherPosition: otherPosition,
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
  console.log("je rentre dans ma page signup");
  try {
    res.status(200).render("signup");
  } catch (err) {
    return res.status(404).json({
      message: "no positions found for this user",
    });
  }
};
