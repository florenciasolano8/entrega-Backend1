import handlebars from "express-handlebars";
import paths from "../utils/paths.js";

export const config = (app) => {
    app.engine("handlebars", handlebars.engine());

    app.set("views", paths.views);  // Establece la carpeta donde están las vistas
    app.set("view engine", "handlebars");  // Define Handlebars como el motor de plantillas
};
