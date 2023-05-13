# VIDEO 05 - Login con JWT

En este vídeo hemos visto lo que es JWT:

JWT significa "JSON Web Tokens" y es un estándar de token de acceso que se utiliza para la autenticación y la seguridad en aplicaciones web. Es un formato compacto y seguro para transmitir información entre dos partes.

JWT está formado por tres partes separadas por un punto: el encabezado, la carga útil y la firma. El encabezado contiene el tipo de token y el algoritmo de cifrado utilizado para firmar la información. La carga útil es la información que se envía como parte del token, como el nombre de usuario, roles, etc. La firma se utiliza para verificar que el token no ha sido alterado durante la transmisión.

Los JWT son autónomos, lo que significa que contienen toda la información necesaria para autenticar y autorizar a un usuario sin necesidad de una consulta adicional a la base de datos. Esto permite una autenticación y autorización más rápida y escalable.

Los JWT se utilizan comúnmente en aplicaciones web para la autenticación de usuarios y en la implementación de sistemas de autorización basados en roles. También se utilizan para la comunicación entre microservicios en arquitecturas de microservicios, ya que pueden ser fácilmente transmitidos y verificados en diferentes aplicaciones y servicios.

Para implementarlo en nuestra aplicación hemos hecho uso de la siguiente librería:

<https://github.com/auth0/node-jsonwebtoken>

Nos hemos creado unas funciones de utilidad para generar tokens y leerlos:

```jsx
// Importamos jwt
const jwt = require("jsonwebtoken");
// Cargamos variables de entorno
require("dotenv").config();

const generateToken = (id, email) => {
  if (!email || !id) {
    throw new Error("Email or userId missing");
  }

  const payload = {
    userId: id,
    userEmail: email,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
  return token;
};

const verifyToken = (token) => {
  if (!token) {
    throw new Error("Token is missing");
  }

  const result = jwt.verify(token, process.env.JWT_SECRET);
  return result;
};

module.exports = { generateToken, verifyToken };
```

Y hemos adaptado nuestro middleware de autenticación para que trabaje con ellas:

```jsx
const { User } = require("../models/User");
const { verifyToken } = require("../utils/token");

const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      throw new Error({ error: "No tienes autorización para realizar esta operación" });
    }

    // Descodificamos el token
    const decodedInfo = verifyToken(token);
    const user = await User.findOne({ email: decodedInfo.userEmail }).select("+password");
    if (!user) {
      throw new Error({ error: "No tienes autorización para realizar esta operación" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json(error);
  }
};

module.exports = { isAuth };
```

Ahora nuestra función de login devolverá un token JWT:

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
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      // Quitamos password de la respuesta
      const userWithoutPass = user.toObject();
      delete userWithoutPass.password;

      // Generamos token JWT
      const jwtToken = generateToken(user._id, user.email);

      return res.status(200).json({ token: jwtToken });
    } else {
      return res.status(401).json({ error: "Email y/o contraseña incorrectos" });
    }
  } catch (error) {
    next(error);
  }
});
```

Recuerda que puedes encontrar en este repositorio todo el código que hemos visto durante la sesión:

<https://github.com/The-Valley-School/node-s10-authentication>
