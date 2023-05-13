# VIDEO 04 - Middleware de autenticación

En este vídeo hemos creado un middleware que comprueba que el usuario está autenticado.

Este middleware esperar que el usuario envíe en las cabeceras el usuario y la contraseña:

```jsx
const bcrypt = require("bcrypt");
const { User } = require("../models/User");

const isAuth = async (req, res, next) => {
  try {
    const { email, password } = req.headers;

    if (!email || !password) {
      return res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { isAuth };
```

Si el email y la contraseña son válidos este middleware dejará la información del usuario disponible en el campo user de la request, de manera que si asociamos este middleware a nuestros endpoints podremos leer la información del usuario:

```jsx
// CRUD: DELETE
router.delete("/:id", isAuth, async (req, res, next) => {
  try {
    const id = req.params.id;

    if (req.user.id !== id && req.user.email !== "admin@gmail.com") {
      return res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
    }

    const userDeleted = await User.findByIdAndDelete(id);
    if (userDeleted) {
      res.json(userDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
});
```
