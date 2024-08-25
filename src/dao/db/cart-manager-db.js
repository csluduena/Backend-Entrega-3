import CartModel from '../models/cart.model.js';

class CartManagerDB {
    async createCart() {
        const cart = new CartModel();
        return await cart.save();
    }

    async getCartById(cartId) {
        return await CartModel.findById(cartId).populate('products.product', '_id title price');
    }

    async addProductToCart(cartId, productId, quantity) {
        const cart = await CartModel.findById(cartId);
        if (!cart) throw new Error('Carrito no encontrado');
        const productIndex = cart.products.findIndex(p => p.product.equals(productId));
        if (productIndex > -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }
        return await cart.save();
    }

    async removeProductFromCart(cartId, productId) {
        const cart = await CartModel.findById(cartId);
        if (!cart) throw new Error('Carrito no encontrado');
        cart.products = cart.products.filter(p => !p.product.equals(productId));
        return await cart.save();
    }
}

export default CartManagerDB;