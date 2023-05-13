# VIDEO 01 - Email y contraseña para usuarios

En este vídeo hemos añadido los campos email y contraseña a nuestros usuarios:

```jsx
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
    ...
		...
		...
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = { User };
```

Lo más interesante que hemos hecho aquí es:

- Añadir la librería validator para comprobar el email
- Hemos indicado a Mongoose que será único (no se repetirán emails)
- Hemos indicado que el campo password no debe mostrarse al hacer un find

A partir de ahora si queremos recuperar el password al hacer find debemos indicarlo expresamente:

```jsx
const user = await User.findById(id).select("+password");
```
