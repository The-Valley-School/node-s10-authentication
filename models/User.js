const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;

// Creamos el schema del usuario
const userSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "Email incorrecto",
      },
    },
    password: {
      type: String,
      trim: true,
      required: true,
      minLength: [8, "La contraseña debe tener al menos 8 caracteres"],
      select: false,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 45,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 45,
    },
    phone: {
      type: String,
      required: false,
      trim: true,
    },
    address: {
      type: {
        street: {
          type: String,
          required: true,
          trim: true,
        },
        number: {
          type: Number,
          required: true,
        },
        city: {
          type: String,
          required: true,
          trim: true,
        },
      },
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = { User };
