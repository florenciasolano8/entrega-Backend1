import ErrorManager from "./ErrorManager.js";
import { isValidID } from "../config/mongoose.config.js";
import CartModel from "../models/cart.models.js";

export default class CartManager {
    #cartModel;

    constructor() {
        this.#cartModel = CartModel;
    }
    async #findOneById(id) {
        if (!isValidID(id)) {
            throw new ErrorManager("ID inválido", 400);
        }

        const cart = await this.#cartModel.findById(id).populate("products.products");

        if (!cart) {
            throw new ErrorManager("ID no encontrado", 404);
        }

        return cart;
    }

    // Obtiene una lista de cart
    async getAll(params) {
        try {
            const paginationOptions = {
                limit: params?.limit || 10, // Número de documentos por página (por defecto 10)
                page: params?.page || 1, // Página actual (por defecto 1)
                populate: "products.product", // Poblar el campo virtual 'prod'
                lean: true, // Convertir los resultados en objetos planos
            };

            return await this.#cartModel.paginate({}, paginationOptions);
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    // Obtiene un carro por su ID
    async getOneById(id) {
        try {
            const cart = await this.#cartModel.findOneById(id).populate('products.products');
            if(!cart){
                throw new ErrorManager("No se encontro el carrito",404);
            }
        } catch (error) {
            throw new Error("Error en la busqueda del carrito" + error.message);
        }
    }

    // Inserta un carro
    async insertOne(data) {
        try {
            const cart = await this.#cartModel.create(data);
            return cart;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    // Agrega un producto al carro o incrementa la cantidad de un producto existente
    async addOneProduct(id, productId) {
        try {
            const cart = await this.#findOneById(id);
            const productIndx = cart.products.findIndex((item) => item.product._id.toString() === productId);

            if (productIndx >= 0) {
                cart.products[productIndx].quantity++;
            } else {
                cart.products.push({product: productId, quantity: 1 });
            }
            await cart.save();
            return cart;

        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    //limpio el carrito
    async clearCart(id){
        try{    
            const cart = await this.#findOneById(id);
            if(!cart){
                throw new ErrorManager("No se encontro el carrito",404);
            }
            cart.products = [];
            await cart.save();
            return cart;
    }
    catch(error){
        throw new ErrorManager(error.message, error,code || 500);
    }
}       
        


    async updateCartById(cartId, products){
        try{
            const cart = await this.#findOneById(cartId);

            if(!Array.isArray(products) || products.some(p => !p.product || !p.quantity)){
                throw new ErrorManager("Formato no valido",400);
            }
            cart.products = products.map(p => ({
                product : p.product,
                quantity: p.quantity
            }));
            await cart.save();
            return cart;
        }
        catch(error){
            throw ErrorManager.handleError(error);
        }
    }


    async removeOneProduct(cartId, productId){
        try{
            const cart = await this. #findOneById(cartId);
            if(!cart) throw new Error("No se encontro el carrito");

            const productIndex = cart.products.findIndex(item => item.product._id.toString() === productId);
            if (productIndex === -1) throw new Error ("No se encontro el producto");

            //elimino
            cart.products.splice(productIndex,1);
            await cart.save();
            return cart;
        }
        catch(error){
            throw new ErrorManager(error.message,error.code);
        }
    }

};