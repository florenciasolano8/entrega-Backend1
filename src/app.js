import express from "express";
import { config as configHandlebars } from "./config/handlebars.config.js";
import { config as configWebsocket } from "./config/websocket.config.js";
import { connectDB } from "./config/mongoose.config.js";
// Importación de enrutadores
import routerProducts from "./routes/products.router.js";
import routerCart from "./routes/cart.router.js";
import routerViewProduct  from "./routes/products.View.router.js";
import routerViewCart from "./routes/cartsView.js";

import path from 'path';

// Se crea una instancia de la aplicación Express
const app = express();

// Se define el puerto en el que el servidor escuchará las solicitudes
const PORT = 8080;

connectDB();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

configHandlebars(app);

app.use("/api/public", express.static(path.public));
app.use("/api/products", routerProducts);
app.use("/api/cart", routerCart);
app.use("/", routerViewProduct);
app.use("/cart", routerViewCart);

app.use("*", (req, res) => {
  res.status(404).render("error", { title: "error 404" });
});

const httpServer = app.listen(PORT, () => {
  console.log(`Ejecutándose en http://localhost:${PORT}`);
});

// Configuración del servidor de websocket
configWebsocket(httpServer);