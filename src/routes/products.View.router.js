import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

//Obtengo todos los productos

router.get("/", async (req, res) => {
    try {
        const { limit, page, title, sort } = req.query;
        const products = await productManager.getAll({ limit, page, title, sort });

        products.docs.forEach(product => {
            product.esCostoso = product.price > 100;
        });
        res.status(200).render("home", { title: "Lista de productos", products });
    } catch (error) {
        res.status(error.code || 500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
    }
});


//Muestro productos en Tiempo Real

router.get("/realTimeProducts", async (req, res) => {
    try {
        const { limit, page, title, sort } = req.query;
        const products = await productManager.getAll({ limit, page, title, sort });
        products = products.docs;
        res.status(200).render("realTimeProducts", { products });
    } catch (error) {
        res.status(error.code || 500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
    }
});

//Obtengo un producto especifico por ID

router.get("/:id", async (req, res) => {
    try {
        const id = req.params?.id;
        const product = await productManager.getOneById(id);
        const plainProduct = product.toObject();
        const result = { status: "success", product: plainProduct };

        res.status(200).render("productforID", result);
    } catch (error) {
        res.status(error.code || 500).render("error", { status: "error", message: error.message, });
    }
});

export default router;