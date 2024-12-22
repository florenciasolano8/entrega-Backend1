import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const productSchema = new Schema({
    title: {
        index:{name : "idx_title"},
        type: String,
        required: [ true, "El nombre es obligatorio" ],
        uppercase: true,
        trim: true,
        minLength: [ 3, "El nombre debe tener al menos 3 caracteres" ],
        maxLength: [ 25, "El nombre debe tener como máximo 25 caracteres" ],
        
    },
    price:{
        type:Number,
        required: [true, "El precio del producto es obligatorio"],
        min: [ 0, "El precio debe ser positivo" ],
    },

    description:{
        type: String,
        required: [ true, "La descripcion del producto es obligatoria" ],
        trim: true,
        minLength: [ 15, "La descripcion del producto debe tener al menos 15 caracteres" ],
        maxLength: [ 25, "La descripcion debe tener como máximo 25 caracteres" ],
    },
    code:{
        type: String,
        required: [ true, "El codigo del producto es obligatoria" ],
        trim: true,
        minLength: [ 3, "El codigo debe tener al menos 3 caracteres" ],
        maxLength: [ 12, "El codigo debe tener como máximo 12 caracteres" ],
    },

    stock: {
        type: Number,
        required: [ true, "El stock es obligatorio" ],
        min: [ 0, "El stock debe ser un valor positivo" ],
    },
    status: {
        type: Boolean,
       required: [true, "El estado es obligatorio"],
    },
    category:{
        index:{name:"idx_category"},
        type: String,
        required: [ true, "La categoria del producto es obligatorio" ],
        uppercase: true,
        trim: true,
        minLength: [ 4, "La categoria debe tener al menos 4 caracteres" ],
        maxLength: [ 25, "La categoria debe tener como máximo 25 caracteres" ],
            
        },
    },
 {
    timestamps: true, 
    versionKey: false, 
});

productSchema.plugin(paginate);

const ProductModel = model("products", productSchema);

export default ProductModel;