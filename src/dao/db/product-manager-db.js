import ProductModel from '../models/product.models.js'; // Asegúrate de que la ruta sea correcta

class ProductManagerDB {
    async getProducts() {
        return await ProductModel.find().lean().exec();;
    }

    async getProductById(productId) {
        return await ProductModel.findById(productId);
    }

    async addProduct(productData) {
        // const product = new ProductModel(productData);
        // return await product.save();
        return await ProductModel.create(productData);
    }

    async updateProduct(productId, updateData) {
        return await ProductModel.findByIdAndUpdate(productId, updateData, { new: true });
    }

    async deleteProduct(productId) {
        return await ProductModel.findByIdAndDelete(productId);
    }
}

export default ProductManagerDB;