const { mongoose } = require("mongoose");
const { connect } = require("../db.js");
const { User } = require("../models/User.js");

const userNormalization = async () => {
  try {
    await connect();
    console.log("Conexíón realizada correctamente.");

    const users = await User.find().select("+password");
    console.log(`Hemos recuperado ${users.length} usuarios de la base de datos`);

    // Actualizamos los campos según las reglas de negocio que queramos
    // Podríamos incluso eliminar datos que no sean correctos
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      await user.save();

      console.log(`Modificado usuario ${user.firstName}`);
    }

    console.log("Modificados todas los usuarios de nuestra base de datos");
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.disconnect();
  }
};

userNormalization();
