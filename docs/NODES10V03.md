# VIDEO 03 - Password encriptada con bcrypt

En este vídeo hemos visto la librería bcrypt:

<https://github.com/kelektiv/node.bcrypt.js>

La librería bcrypt es una biblioteca de funciones de hashing de contraseñas que se utiliza para almacenar contraseñas de forma segura. La librería es popular debido a que utiliza un algoritmo de hash "lento" y "costoso" que dificulta que un atacante pueda descifrar las contraseñas almacenadas en caso de que logre acceder a ellas.

Bcrypt utiliza una técnica conocida como "hashing de contraseña adaptativo" que consiste en aplicar una función de hash varias veces en una contraseña, utilizando una técnica conocida como "salting" que agrega una cadena aleatoria de datos a la contraseña antes de hashearla. Este proceso hace que sea más difícil para un atacante descifrar las contraseñas almacenadas mediante la fuerza bruta o mediante el uso de diccionarios de contraseñas comunes.

Hemos instalado la librería mediante el comando:

```jsx
npm i bcrypt
```

Tras esto, hemos indicando en el Schema de usuarios que antes del guardado encripte la contraseña si se ha modificado:

```jsx
userSchema.pre("save", async function (next) {
  try {
    // Si la contraseña ya estaba encriptada, no la encriptamos de nuevo
    if (this.isModified("password")) {
      const saltRounds = 10;
      const passwordEncrypted = await bcrypt.hash(this.password, saltRounds);
      this.password = passwordEncrypted;
    }

    next();
  } catch (error) {
    next(error);
  }
});
```

También hemos modificado el código de nuestro seed y nuestro PUT para que siempre funcionen haciendo uso de “save” para que se ejecute el encriptado.

Nuestra función de login también se ha visto afectada, ya que ahora la password se debe comprobar con la función compare de bcrypt:

```jsx
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
    const match = await bcrypt.compare(password, user.password);
    if (match) {
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
