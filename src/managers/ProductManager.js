import ErrorManager from "./ErrorManager.js";
import { isValidID } from "../config/mongoose.config.js";
import ProductModel from "../models/product.model.js";
import { convertToBool} from "../utils/converter.js";

export default class ProductManager {
    #product;

    constructor() {
        this.#product = ProductModel;
    }
    async #findOneById(id) {
        if (!isValidID(id)) {
            throw new ErrorManager("ID inválido", 400);
        }

        const productFound = await this.#product.findById(id);

        if (!productFound) {
            throw new ErrorManager("ID no encontrado", 404);
        }

        return productFound;
    }

    // Obtiene una lista de prod
    async getAll(params) {
        try {    
            const $and = [];
    
            if (params?.title) $and.push({ title: { $regex: params.title, $options: "i" } });
            const filters = $and.length > 0 ? { $and } : {};
    
            const sort = {
                asc: { title: 1 },
                desc: { title: -1 },
            };
    
            const paginationOptions = {
                limit: params?.limit || 10,
                page: params?.page || 1,
                sort: sort[params?.sort] ?? {}, 
                lean: true, 
            };
    
            const paginatedProducts = await this.#product.paginate(filters, paginationOptions);
    
            return paginatedProducts;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }
    

    async getOneById(id) {
        try {
            return await this.#findOneById(id);
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    async insertOne(data) {
        try {
            const product = await this.#product.create({
                ...data,
                status: convertToBool(data.status),
            });

            return product;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    async updateOneById(id, data) {
        try {
            const product = await this.#findOneById(id);
            const newValues = {
                ...product,
                ...data,
                status: data.status ? convertToBool(data.status) : product.status,
            };

            product.set(newValues);
            product.save();

            return product;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    async deleteOneById(id) {
        try {
            const product = await this.#findOneById(id);
            await product.deleteOne();
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }
}