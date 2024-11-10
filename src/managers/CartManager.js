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

    async $findOneById(id){
        this.#carts = await this.getAll();
        const cartsFound = this.#carts.find((item) => item.id === Number(id));

        if(!cartsFound){
            throw new ErrorManager("Id no encontrado",404);
        }
        return cartsFound
    }

    async getAll(){
    try{
        this.#carts = await readJsonFile(paths.files, this.#jsonFilename);
        return this. #carts;
    }catch(error){
        throw new ErrorManager(error.message, error.code);
    }
}

    async getOneById(id){
        try{
            const cartsFound = await this.$findOneById(id);
            return cartsFound;
        }catch(error){
            throw new ErrorManager(error.message, error.code);
        }
    }


    async insertOne(data){
    try{
        const {title, status, stock} = data;
        if (!title || status === null || status === undefined || !stock){
            throw new ErrorManager("Faltan datos obligatorios",400);
        }
        const cart = {
            id: generateId(await this.getAll()),
            title,
            status,
            stock,
        };

        this.#carts.push(cart);
        await writeJsonFile(paths.files, this.#jsonFilename, this.#carts);
        return cart;

    }catch(error){
        throw new ErrorManager(error.message, error.code);
  }
}
}