import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const cartManager = new CartManager();

router.get("/", async (req, res) => {
    try{
        const carts = await cartManager.getAll();
        res.status(200).json({ status: "success", payload: carts });
    }catch(error){
        res.status(error.code || 500).json({status: "error", message:error.message});
    }
});


router.get("/:cid", async (req, res) => {
    try{
        const cart = await cartManager.getOneById(req.params?.cid);
        res.status(200).json({ status: "success", payload: cart});
    }catch(error){
        res.status(error.code || 500).json({status: "error", message:error.message});
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    try{
        const updateCart = await cartManager.addOneProduct(req.params.cid,req.params.pid);
        res.status(201).json({ status: "success", payload: updateCart});
    }catch(error){
        res.status(error.code || 500).json({status: "error", message:error.message});
    }
});

router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json({ status: "success", payload: newCart });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});


//ADD
router.put("/:cid/product/:pid", async (req, res) => {
    try{
        const updateCart = await cartManager.addOneProduct(req.params.cid,req.params.pid);
        res.status(201).json({ status: "success", payload: updateCart});
    }catch(error){
        res.status(error.code || 500).json({status: "error", message:error.message});
    }
});


router.delete("/:cid/product", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.clearCart(cid);
        if (!cart) {
            return res.status(404).json({ status: "error", message: "No se encontro el carrito." });
        }
        res.status(200).json({ status: "success", payload: cart, message: "Carrito vaciado con exito." });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

router.delete("/:cid/product/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartManager.removeOneProduct(cid, pid);
        if (!cart) {
            return res.status(404).json({ status: "error", message: "No se encontro el producto en el carrito." });
        }
        res.status(200).json({ status: "success", payload: cart, message: "Producto eliminado con exito." });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

router.post("/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        let cart = await cartManager.getOneById(cartId);
        if (!cart) {
            cart = await cartManager.insertOne({ product: [] });
        }

        res.status(200).json({ status: "success", payload: cart, message: "Carrito creado con exito." });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

router.put("/:cid", async (req, res) => {
    const cartId = req.params.cid;
    const product = req.body.product;

    try {
        const updatedCart = await cartManager.updateCartById(cartId, product);
        res.status(200).json({ status: "success", payload: updatedCart, message: "Carrito actualizado!" });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});


export default router;