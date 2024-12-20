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
        const updateCart = await cartManager.addProductToCart(req.params.cid,req.params.pid);
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

export default router;