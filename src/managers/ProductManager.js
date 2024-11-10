import paths from "../utils/paths.js";
import {readJsonFile, writeJsonFile} from "../utils/fileHandler.js";
import {generateId} from "../utils/collectionHandler.js";
import {convertToBool} from "../utils/converter.js";
import ErrorManager from "./ErrorManager.js";


export default class ProductManager{
    #jsonFilename;
    #products;

    constructor(){
        this.#jsonFilename = "products.json";
    }

    async $findOneById(pid){
        this.#products = await this.getAll();
        const productsFound = this.#products.find((item) => item.id === Number(pid));

        if(!productsFound){
            throw new ErrorManager("Id no encontrado",404);
        }
        return productsFound;
    }

    async getAll(){
    try{
        this.#products = await readJsonFile(paths.files, this.#jsonFilename);
        return this. #products;
    }catch(error){
        throw new ErrorManager(error.message, error.code);
    }
}

    async getOneById(pid){
        try{
            const productsFound = await this.$findOneById(pid);
            return productsFound;
        }catch(error){
            throw new ErrorManager(error.message, error.code);
        }
    }


    async insertOne(data){
    try{
        const {title,description,code,price,stock,category,thumbnails, status} = data;
        if (!title || !description || !code || !price || !stock || !category){
            throw new ErrorManager("Faltan datos obligatorios",400);
        }
        const product = {
            id: generateId(await this.getAll()),
            title,
            description,
            code,
            price: Number(price),
            status: convertToBool(status),
            stock:Number(stock),
            category,
            thumbnails: thumbnails || [],
        };

        this.#products.push(product);
        await writeJsonFile(paths.files, this.#jsonFilename, this.#products);
        return product;

    }catch(error){
        throw new ErrorManager(error.message, error.code);
  }
}


async updateOneById(pid,data){
    try{
        const productsFound = await this.$findOneById(pid);

        const product = {
            id:productsFound.id,
            title: data.title || productsFound.title,
            description: data.description || productsFound.description,
            code: data.code || productsFound.code,
            price: data.price !== undefined ? Number(data.price) : productsFound.price, 
            status: data.status !== undefined ? convertToBool(data.status) : productsFound.status,
            stock: data.stock !== undefined ? Number(data.stock) : productsFound.stock,
            category:data.category || productsFound.category,
            thumbnails: data.thumbnails || productsFound.thumbnails
        };

        const index = this.#products.findIndex((item)=> item.id === Number(pid));
        this.#products[index]= product;
        await writeJsonFile(paths.files, this.#jsonFilename, this.#products);
        return product;

    }catch(error){
        throw new ErrorManager(error.message, error.code);
  }
}


async deleteOneById(pid){
    try{
         await this.$findOneById(pid);

        const index = this.#products.findIndex((item)=> item.id === Number(pid));
        this.#products.splice(index,1);
        await writeJsonFile(paths.files, this.#jsonFilename, this.#products);
    }catch(error){
        throw new ErrorManager(error.message, error.code);
  }
}
}