import paths from "../utils/paths.js";
import {readJsonFile, writeJsonFile} from "../utils/fileHandler.js";
import {generateId} from "../utils/collectionHandler.js";
import ErrorManager from "./ErrorManager.js";


export default class cartManager{
    #jsonFilename;
    #carts;

    constructor(){
        this.#jsonFilename = "carts.json";
    }


    async  productExists(pid){
        try{
            const products= await readJsonFile(paths.files,"products.json");
            return products.some(product => product.id === Number(pid));
        } catch(error){
            throw new ErrorManager("Error al leer los productos",500);
        }
    }


    async $findOneById(cid){
        this.#carts = await this.getAll();
        const cartsFound = this.#carts.find((item) => item.id === Number(cid));

        if(!cartsFound){
            throw new ErrorManager("Id no encontrado",404);
        }
        return cartsFound;
    }

    async getAll(){
    try{
        this.#carts = await readJsonFile(paths.files, this.#jsonFilename);
        return this.#carts;
    }catch(error){
        throw new ErrorManager(error.message, error.code);
    }
}

    async getOneById(cid){
        try{
            const cartsFound = await this.$findOneById(cid);
            return cartsFound;
        }catch(error){
            throw new ErrorManager(error.message, error.code);
        }
    }


    async insertOne(data){
    try{
        const products = data?.products?.map(((item)=>{
            return {product: Number(item.product), quantity: 1};
        }));

        const cart = {
            id: generateId(await this.getAll()),
            products : products || [],
        };

        this.#carts.push(cart);
        await writeJsonFile(paths.files, this.#jsonFilename, this.#carts);
        return cart;

    }catch(error){
        throw new ErrorManager(error.message, error.code);
  }
}

    async addProductToCart(cid,pid){
        try{
            const productExists = await this.productExists(pid);
            if(!productExists){
                throw new ErrorManager("Producto no encontrado",404);
            }

            const cart = await this.$findOneById(cid);
            const productIndex = cart.products.findIndex((item)=> item.product === Number(pid));

            if(productIndex !== -1){
                cart.products[productIndex].quantity +=1;
            }else{
                cart.products.push({product: Number(pid),quantity:1});
            }
            await writeJsonFile(paths.files, this.#jsonFilename, this.#carts);
            return cart;
        }catch(error){
            throw new ErrorManager(error.message, error.code);
        }
    }
}