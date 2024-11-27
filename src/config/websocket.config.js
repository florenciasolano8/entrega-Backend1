import { Server } from "socket.io";
import ProductManager from "../managers/ProductManager.js";

const productManager = new ProductManager();

// Configura el servidor Socket.IO
export const config = (httpServer) => {
    // Crea una nueva instancia del servidor Socket.IO
    const socketServer = new Server(httpServer);

    // Escucha el evento de conexión de un nuevo cliente
    socketServer.on("connection", async (socket) => {
        console.log("Conexión establecida", socket.id); 
        socketServer.emit("products-list", { products: await productManager.getAll() });

        socket.on("insert-products", async (data) => {
            try {
                await productManager.insertOne(data);
                socketServer.emit("products-list", { products: await productManager.getAll() });
            } catch (error) {
                socketServer.emit("error-message", { message: error.message });
            }
        });

        socket.on("delete-products", async (data) => {
            try {
                await productManager.deleteOneById(data.id);
                socketServer.emit("products-list", { products: await productManager.getAll() });
            } catch (error) {
                socketServer.emit("error-message", { message: error.message });
            }
        });




        socket.on("disconnect", () => {
            console.log("Se desconecto un cliente", socket.id); 
        });
    });
};
