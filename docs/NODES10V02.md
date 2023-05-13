# VIDEO 02 - Petición de login sin seguridad

En este video hemos creado una petición /user/login que nos permite enviar un email y contraseña a la API en el body, y nos indicará si son correctos.

Esta petición actualmente no hace mucho más, no aporta seguridad aún:

```jsx
// LOGIN DE USUARIOS
router.post("/login", async (req, res, next) => {
  try {
    // const email = req.body.email;
    // const password = req.body.password;
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Se deben especificar los campos email y password" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      // return res.status(404).json({ error: "No existe un usuario con ese email" });
      // Por seguridad mejor no indicar qué usuarios no existen
      return res.status(401).json({ error: "Email y/o contraseña incorrectos" });
    }

    // Comprueba la pass
    if (user.password === password) {
      // Quitamos password de la respuesta
      const userWithoutPass = user.toObject();
      delete userWithoutPass.password;

      return res.status(200).json(userWithoutPass);
    } else {
      return res.status(401).json({ error: "Email y/o contraseña incorrectos" });
    }
  } catch (error) {
    next(error);
  }
});
```
