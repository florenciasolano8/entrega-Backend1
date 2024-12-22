import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";
import multer from 'multer'; 
import product from '../models/product.model.js'; 

const router = Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    const { category = '', sort = '', page = 1 } = req.query; 
      
    try {
      let filter = {};
      if (category) {
        filter.category = category;  
      }
  
      let sortOrder = {};
      if (sort) {
        sortOrder[sort] = 1;
      }
  
      const itemsPerPage = 10;
      const skip = (page - 1) * itemsPerPage;
  
      const products = await product.find(filter) 
        .sort(sortOrder) 
        .skip(skip) 
        .limit(itemsPerPage); 

        res.json(products);
    } catch (err) {
      console.error('Error al obtener productos:', err);
      res.status(500).json({ error: 'Error al obtener productos' }); 
    }
  });

router.get("/:pid", async (req, res) => {
    try{
        const product = await productManager.getOneById(req.params?.pid);
        res.status(200).json({ status: "success", payload: product});
    }catch(error){
        res.status(error.code || 500).json({status: "error", message:error.message});
    }
});

router.post("/", async (req, res) => {
    try{
        const product = await productManager.insertOne(req.body);
        res.status(201).json({ status: "success", payload: product});
    }catch(error){
        res.status(error.code || 500).json({status: "error", message:error.message});
    }
});

router.put("/:pid", async (req, res) => {
    try{
        const product = await productManager.updateOneById(req.params?.pid,req.body);
        res.status(200).json({ status: "success", payload: product});
    }catch(error){
        res.status(error.code || 500).json({status: "error", message:error.message});
    }
});

router.delete("/:pid", async (req, res) => {
    try{
        const product = await productManager.deleteOneById(req.params?.pid);
        res.status(200).json({ status: "success"});
    }catch(error){
        res.status(error.code || 500).json({status: "error", message:error.message});
    }
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');  
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/api/products', upload.single('file'), (req, res) => {

    const { title, price, category, stock, code, description, status } = req.body;

    if (!title || !price || !category || !stock || !code || !description) {
        return res.status(400).json({
            status: 'error',
            message: 'Todos los campos obligatorios deben ser completados.'
        });
    }

    let imagePath = '';
    if (req.file) {
        imagePath = req.file.path; 
    }

    const newProduct = new product({
        title,
        price,
        category,
        stock,
        code,
        description,
        status: status ? true : false, 
        image: imagePath
    });

    newProduct.save()
        .then(product => {
            res.status(201).json({
                status: 'success',
                message: 'Producto creado con éxito',
                payload: product
            });
        })
        .catch(error => {
            res.status(500).json({
                status: 'error',
                message: 'Error al guardar el producto',
                error: error.message
            });
        });
});

export default router;