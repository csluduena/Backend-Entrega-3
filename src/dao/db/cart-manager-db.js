import CartModel from "../models/cart.model.js";

class CartManager {
    async createCart() {
        try {
            const newCart = new CartModel({ products: [] });
            await newCart.save();
            return newCart;
        } catch (error) {
            console.log("Error creating new cart");
            throw error;
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await CartModel.findById(cartId).populate('products.product', '_id title price');
            console.log('Cart found by ID');
            if (!cart) {
                console.log("Cart with the specified ID does not exist");
                return null;
            }
            return cart;
        } catch (error) {
            console.log("Error retrieving the cart", error);
            throw error;
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await this.getCartById(cartId);

            const existingProduct = cart.products.find(item => item.product._id.toString() === productId.toString());

            if (existingProduct) {
                existingProduct.quantity += quantity;
                console.log('Successfully added to existing product');
            } else {
                console.log('First time in the cart');
                cart.products.push({ product: productId, quantity });
            }

            cart.markModified("products");

            await cart.save();
            return cart;

        } catch (error) {
            console.log("Error adding a product", error);
            throw error;
        }
    }

    async getAllCarts() {
        try {
            // Recupera todos los carritos desde la base de datos utilizando el modelo correcto
            const carts = await CartModel.find({}, '_id');

            // Retorna la cantidad de carritos y sus IDs
            return {
                count: carts.length,
                carts: carts.map(cart => cart._id)
            };
        } catch (error) {
            console.error('Error retrieving carts:', error);
            throw new Error('Could not retrieve carts');
        }
    }


    async deleteItem(itemId, cartId) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error('Cart not found');
            }

            const index = cart.products.findIndex(item => item.product._id.toString() === itemId.toString());

            if (index !== -1) {
                cart.products.splice(index, 1);
                await cart.save();
                console.log('Item removed from cart');
            } else {
                console.log('Item not found in cart');
            }
        } catch (error) {
            console.error('Error removing the item:', error);
            throw error;
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await CartModel.findOneAndUpdate(
                { _id: cartId, "products.product": productId },
                { $set: { "products.$.quantity": quantity } },
                { new: true }
            ).populate('products.product');

            if (!cart) {
                console.log('Product not found in cart');
                throw new Error('Product not found in cart');
            }

            console.log('Product quantity updated');
            return cart;
        } catch (error) {
            console.log("Error updating product quantity", error);
            throw error;
        }
    }

    async emptyCart(cartId) {
        try {
            await CartModel.findByIdAndUpdate(
                cartId,
                { $set: { products: [] } },
                { new: true }
            );
            console.log('Cart emptied successfully');
        } catch (error) {
            console.log("Error emptying the cart", error);
            throw error;
        }
    }
}

export default CartManager;
