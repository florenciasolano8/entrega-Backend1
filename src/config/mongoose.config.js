import { connect, Types } from "mongoose";

// Conecta con la base de datos MongoDB
export const connectDB = async () => {
    const URL = "mongodb+srv://flor:1234@cluster0.6qx0r.mongodb.net/prueba";

    try {
        await connect(URL);
        console.log("Conectado a MongoDB");
    } catch (error) {
        console.log("Error al conectar con MongoDB", error.message);
    }
};

// Verifica que un ID sea válido con el formato de ObjectId de MongoDB
export const isValidID = (id) => {
    return Types.ObjectId.isValid(id);
};