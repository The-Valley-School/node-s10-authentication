# VIDEO 06 - Ejercicio: Proteger API de libros

En este ejercicio debes partir del código de la sesión 9 (API de libros y autores + subida de ficheros).

Sobre esa API debes realizar los siguientes cambios:

- Añade el campo usuario y contraseña a los autores de libros
- Crea una ruta para hacer login con la información de un autor, esa ruta debe devolver un token jwt
- Protege las operaciones PUT y DELETE de autores para que solo se puedan hacer si está el autor logado
- Adapta el código todo lo que necesites para que funcione correctamente (seeds, puts, validaciones… etc)

Recuerda que puedes encontrar en este repositorio todo el código que hemos visto durante la sesión:

<https://github.com/The-Valley-School/node-s10-authentication>
