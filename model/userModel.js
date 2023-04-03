const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please tell us your name"],
  },
  email: {
    type: String,
    required: [true, "Please tell us your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "please provide a valid email"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false, //pour éviter que le password apparaisse dans les sorties
  },
  passwordConfirm: {
    type: String,
    required: [true, "please confirm your password"],
    validate: {
      //ca marche seulement sur create et save
      validator: function (el) {
        return el === this.password;
      },
      message: "password are not the same",
    },
  },
  passwordChangedAt: Date,
  // positions:{
  //   type: mongoose.Schema.ObjectId, //ici je prends l'id que mongoose affecte à chaque nouveau document
  //   ref: "Position",
  //   required: [true, "Position must belong to a user"],
  // }
});

// pre est un middleware
//le save permet de s'appliquer ici entre le moment ou on reçoit les données et le moment ou elles sont envoyées à la base de donnée
// this refer to the current document
userSchema.pre("save", async function (next) {
  //si on modifie pas le password
  if (!this.isModified("password")) return next();
  // la on encrypte le password
  this.password = await bcrypt.hash(this.password, 12);
  //et on met le password confirm en undefined pour pas qu'on le voit
  this.passwordConfirm = undefined;
  next();
});

// an instance method
//compare est une fonction de bcrypt
//on l'utilise car on ne peut pas comparer en utilisant mongoose car password est en mode select:false
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
//cette method va tester si l'utilisateur a changé son password après avoir récupérer un token
//passwordChangedAt est un
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    // gettime est une des fonctions de temps du js
    const changedTimesStamp = parseint(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(changedTimesStamp, JWTTimestamp);
    return JWTTimestamp < changedTimesStamp;
  }
  //false means no change
  return false;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
