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
