import paths from "/paths.js";
import {readJsonFile, writeJsonFile} from "../utils/fileHandler.js";
import {generateId} from "../utils/collectionHandler.js";
import {convertToBool} from "../utils/converter.js";


export default class ProductManager{
    #jsonFilename;
    #products;

    constructor(){
        this.#jsonFilename = "products.json";
    }

    async $findOneById(id){
        this.#products = await this.getAll();
        const productsFound = this.#products.find((item) => item.id === Number(id));

        if(!productsFound){
            throw new Error("Id no encontrado");
        }
    }

    async getAll(){
    try{
        this.#products = await readJsonFile(paths.files, this.#jsonFilename);
        return this. #products;
    }catch(error){
        throw new Error("Falla obtener todos");
    }
}

    async getOneById(id){
        try{
            const productsFound = await this.$findOneById(id);
            return productsFound;
        }catch(error){
            throw new Error("Falla obtener todos");
    }
    }


    async insertOne(data){
    try{
        const {title, status, stock} = data;
        if (!title || status === null || status === undefined || !stock){
            throw new Error("Faltan datos obligatorios");
        }
        const product = {
            id: generateId(await this.getAll()),
            title,
            status,
            stock,
        };

        this.#products.push(product);
        await writeJsonFile(paths.files, this.#jsonFilename, this.#products);
        return product;

    }catch(error){
        throw new Error("Falla obtener todos");
  }
}


async updateOneById(id,data){
    try{
        const {title, status, stock} = data;
        const productsFound = await this.$findOneById(id);

        const product = {
            id:productsFound.id,
            title: title || productsFound.title,
            status: status ? convertToBool(status) : productsFound.status,
            stock: stock ? Number(stock) : productsFound.stock,
        };

        const index = this.#products.findIndex((item)=> item.id === Number(id));
        this.#products[index]= product;
        await writeJsonFile(paths.files, this.#jsonFilename, this.#products);
        return product;

    }catch(error){
        throw new Error("Falla obtener todos");
  }
}


async deleteOneById(id){
    try{
         await this.$findOneById(id);

        const index = this.#products.findIndex((item)=> item.id === Number(id));
        this.#products.splice(index,1);
        await writeJsonFile(paths.files, this.#jsonFilename, this.#products);
        return product;

    }catch(error){
        throw new Error("Falla obtener todos");
  }
}
}