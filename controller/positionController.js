const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const Position = require("../model/positionModel");

exports.getAllPositions = async (req, res, next) => {
  try {
    const positions = await Position.find();
    res.status(200).json({
      status: "success",
      data: positions,
      // message: "here is your all positions of trees",
    });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({
      message: "failed to get all positions",
    });
  }
};

exports.createPosition = async (req, res, next) => {
  try {
    const newPosition = await Position.create({
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      type: req.body.type,
      user: req.user._id,
    });
    res.status(201).json({
      status: "success",
      data: newPosition,
    });
  } catch (err) {
    return res.status(400).json({
      message: "failed to create position",
      erreur: err,
    });
  }
};
//je récupère toutes les positions de la personne connectée
exports.getMyPositions = async (req, res, next) => {
  // il faut que je récupère l'id de mon utilisateur actuelle qui est connecté comme ca je peux avoir accès aux points
  //et je garde seulement les latitudes et longitudes
  try {
    const myPosition = await Position.find({ user: req.user._id }).select(
      "-user -_id -__v"
    );
    res.status(200).json({
      status: "success",
      data: myPosition,
    });
  } catch (err) {
    return res.status(404).json({
      message: "no positions found for this user",
    });
  }
};
exports.getOtherPositions = async (req, res, next) => {
  // il faut que je récupère l'id de mon utilisateur actuelle qui est connecté comme ca je peux avoir accès aux points
  //et je garde seulement les latitudes et longitudes
  try {
    const otherPositions = await Position.find({
      user: { $ne: req.user._id },
    }).select("-user -_id -__v");
    res.status(200).json({
      status: "success",
      data: otherPositions,
    });
  } catch (err) {
    return res.status(404).json({
      message: "no positions found for this user",
    });
  }
};
exports.deletePosition = async (req, res, next) => {
  const position = await Position.findByIdAndDelete(req.params.id);
  if (!position) {
    res.status(404).json({
      status: "error",
      message: "cant delete this positions",
    });
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
};
exports.getTopThreePositions = async (req, res, next) => {
  try {
    const treeObjects = {
      erable: 0,
      platane: 0,
      tilleul: 0,
      cerisier: 0,
      micocoulier: 0,
      frene: 0,
      chene: 0,
      autre: 0,
    };
    treeObjects.platane = await Position.countDocuments({ type: "platane" });
    treeObjects.erable = await Position.countDocuments({ type: "erable" });
    treeObjects.tilleul = await Position.countDocuments({ type: "tilleul" });
    treeObjects.cerisier = await Position.countDocuments({ type: "cerisier" });
    treeObjects.micocoulier = await Position.countDocuments({
      type: "micocoulier",
    });
    treeObjects.frene = await Position.countDocuments({ type: "frene" });
    treeObjects.chene = await Position.countDocuments({ type: "chene" });
    treeObjects.autre = await Position.countDocuments({ type: "autre" });
    //je trie la quantité de mes arbres par ordre croissant et je renvoie les 3 premiers
    const keyValues = Object.entries(treeObjects);
    const topThreeTrees = keyValues.sort((a, b) => b[1] - a[1]).slice(0, 3);
    const topThreeObject = Object.fromEntries(topThreeTrees);
    res.locals.topThreeObject = topThreeObject;
    next();
  } catch (err) {
    return res.status(400).json({
      message: "failed to load ressource",
      erreur: err,
    });
  }
};
