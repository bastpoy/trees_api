const { promisify } = require("util");
const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
let expiredToken;

const signToken = (id) => {
  //ici on crée un token que l'on va attribuer a chaque fois que l'utilsiateur
  //manipule son mot de passe
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  //le cookies ooptions permet de paramétrer le durée de validité du token
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.cookie("jwt", token, cookieOptions);
  //enelevr le mot de passe de l'output
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
exports.signup = async (req, res, next) => {
  try {
    //si les deux mots de passes ne sont pas egaux je renvoies une erreur
    if (req.body.password != req.body.passwordConfirm) {
      return res.status(400).json({
        message: "les deux mots de passe ne sont pas les mêmes ",
      });
    }
    // je regarde si un user existe déjà a cet email
    const existentUser = await User.findOne({ email: req.body.email });
    if (existentUser) {
      return res.status(400).json({
        message: "il y a déjà un utilisateur avec cet email ",
      });
    }
    //si j'ai pas d'erreurs je crée mon user
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      // role: req.body.role,
    });

    createSendToken(newUser, 201, res);
  } catch (err) {
    return res.status(400).json({
      message: "failed to create user",
    });
  }
};
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //1) check if email and password actually exist
    if (!email || !password) {
      //j'utilise return parce que sinon il me met une erreur comme quoi je ne peux pas
      return res.status(400).json({
        message: "provide password and email",
      });
    }
    //2) check if user exist and password is correct
    //select permet de sélectionner les éléments que l'on souhaite voir apparaître dans l'output
    //parce que de base dans la base de donnée le password n'est pas affiché
    const user = await User.findOne({ email: email }).select("+password");
    //ceci est la fonction que nous avons déclaré dans le mongoose model
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).send({
        status: "error",
        error: "incorrect email or password or no user for this identifier",
      });
    }
    //3) if everything ok, send token to client
    createSendToken(user, 200, res);
  } catch (err) {
    console.log(err);
    return err.message;
  }
};
// on va overwrite le token dans le cookie avec un "faux" token
exports.logout = async (req, res) => {
  //donc a la place du token on écrit loggedout ou on aurait pu écrire un autre truc mais on le rempalce par quelque chose
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  //on ne peut pas redirect sur une autre page il faut reload côté frontend
  res.status(200).json({ status: "success" });
};
exports.protect = async (req, res, next) => {
  // récupérer le token et regarder si il est présent
  //le token est présent dans le header dans le champ authorization
  // il est stocké après le bearer
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      console.log("dans le bearer");
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      // avant d'affecter le token à ma variable token je vérifie si la durée du token n'a pas expiré
      if (expiredToken < Date.now() / 1000) {
        console.log("durée token expirée");
        expiredToken = undefined;
        return res.redirect(301, "/");
      }
      token = req.cookies.jwt;
    }

    if (!token) {
      return res
        .status(401)
        .json({
          status: "error",
          message: "you are not logged in, please log in to get acces",
        })
        .redirect("/");
    }
    //je stocke le temps d'expiration dans une variable globale pour savoir par la suite si mon token a expiré
    expiredToken = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET).exp;

    //Vérifier le token
    //le verify provient de la bibliothèque jwt qui regarde si notre token est valide
    //ici on compare le token actuelle avec notre secret string qui "ecnrypte" le token
    // promisify permet de rendre le callback function de jwt.verify asynchrone pour ensuite utiliser async await
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    //decoded nous retourne l'id de compass de la personne qui avait le token
    //vérifier si l'utilisateur existe toujours
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      return res.status(401).json({
        status: "error",
        message: "the user belonging to the user no longer exist",
      });
    }
    //regarder si l'utilisateur a changé son mdp après que le token soit donnée
    if (freshUser.changedPasswordAfter(decoded.iat)) {
      res.status(401).json({
        status: "error",
        message: "user recently change password log in again",
      });
    }
    req.user = freshUser;
    //GRANT ACCESS TO PROTECTED ROUTE
    next();
  } catch (err) {
    res.redirect(308, "/");
  }
};
exports.restrictTo = (...roles) => {
  //je crée un tableau en utilisant ...roles
  return (req, res, next) => {
    //roles que je passe dans la fonction est un tableau
    //includes est une fonction js
    // on récupère le req.user du middleware d'avant.
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "you cant access this section because you are not an admin",
      });
    }
    next();
  };
};
