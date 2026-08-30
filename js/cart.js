const Cart = {

    items: [],

    add(product) {

        const existing = this.items.find(
            item => item.id === product.id
        );

        if (existing) {

            if (existing.qty >= product.stock) {
                return {
                    success: false,
                    message: "Maximum stock reached"
                };
            }

            existing.qty++;

        } else {

            this.items.push({
                id: product.id,
                barcode: product.barcode,
                name: product.name,
                category: product.category,
                price: product.price,
                cost: product.cost,
                emoji: product.emoji,
                unit: product.unit,
                qty: 1
            });
        }

        return {
            success: true
        };
    },


    increase(productId) {

        const item = this.items.find(
            item => item.id === productId
        );

        if (!item) return false;

        const product = PRODUCTS.find(
            product => product.id === productId
        );

        if (item.qty >= product.stock) {
            return false;
        }

        item.qty++;

        return true;
    },


    decrease(productId) {

        const item = this.items.find(
            item => item.id === productId
        );

        if (!item) return;

        item.qty--;

        if (item.qty <= 0) {
            this.remove(productId);
        }
    },


    remove(productId) {

        this.items = this.items.filter(
            item => item.id !== productId
        );
    },


    clear() {

        this.items = [];
    },


    count() {

        return this.items.reduce(
            (total, item) => total + item.qty,
            0
        );
    },


    subtotal() {

        return this.items.reduce(
            (total, item) =>
                total + (item.price * item.qty),
            0
        );
    },


    isEmpty() {

        return this.items.length === 0;
    }
};