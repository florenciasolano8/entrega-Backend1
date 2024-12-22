import { Server } from "socket.io";
import ProductManager from "../managers/ProductManager.js";

const productManager = new ProductManager();

export const config = (httpServer) => {
    const socketServer = new Server(httpServer);

    socketServer.on("connection", async (socket) => {
        console.log("Conexión establecida", socket.id); 
        socketServer.emit("products-list", { products: await productManager.getAll({
            limit:10,
            page:1,
            sort:"asc",
        }),
    });

        socket.on("insert-products", async (data) => {
            try {
                console.log(data);
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
