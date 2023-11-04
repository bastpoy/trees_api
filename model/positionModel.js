const mongoose = require("mongoose");
const validate = require("validator");

const positionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      "platane",
      "erable",
      "tilleul",
      "cerisier",
      "micocoulier",
      "frene",
      "chene",
      "autre",
    ],
    // required: [true, "A position must have a type"],
  },
  latitude: {
    type: String,
    required: [true, "A position must have a latitude"],
  },
  longitude: {
    type: String,
    required: [true, "A position must have a longitude"],
  },
  //icije dis que je veux populate le user
  //donc quand je vais récupérer une position j'aurai l'user auquelle elle correspond
  user: {
    type: mongoose.Schema.ObjectId, //ici je prends l'id que mongoose affecte à chaque nouveau document
    ref: "User",
    required: [true, "Position must belong to a user"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

positionSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "email name",
  });
  next();
});

const Position = mongoose.model("Position", positionSchema);
module.exports = Position;
