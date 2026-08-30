const state = {
    cart: [],
    category: "All",
    customer: null,
    paymentMethod: null
};


/* =========================
   BASIC HELPERS
========================= */

const $ = (id) => document.getElementById(id);

const money = (amount) =>
    "Rs. " +
    Number(amount).toLocaleString("en-LK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });


/* =========================
   CATEGORIES
========================= */

function renderCategories() {

    const categories = [
        "All",
        ...new Set(PRODUCTS.map(product => product.category))
    ];

    $("categories").innerHTML = categories
        .map(category => `
            <button
                class="category ${category === state.category ? "active" : ""}"
                data-category="${category}">
                ${category}
            </button>
        `)
        .join("");

    document.querySelectorAll(".category").forEach(button => {

        button.addEventListener("click", () => {

            state.category = button.dataset.category;

            renderCategories();
            renderProducts();

        });

    });
}


/* =========================
   PRODUCTS
========================= */

function renderProducts() {

    const search = $("searchInput")
        .value
        .trim()
        .toLowerCase();

    const filteredProducts = PRODUCTS.filter(product => {

        const categoryMatch =
            state.category === "All" ||
            product.category === state.category;

        const searchMatch =
            !search ||
            product.name.toLowerCase().includes(search) ||
            product.barcode.includes(search);

        return categoryMatch && searchMatch;

    });


    if (filteredProducts.length === 0) {

        $("products").innerHTML = `
            <div class="empty">
                <div>🔎</div>
                <b>No products found</b>
                <span>Try another product or barcode</span>
            </div>
        `;

        return;
    }


    $("products").innerHTML = filteredProducts
        .map(product => {

            let stockClass = "";
            let stockText = `${product.stock} in stock`;

            if (product.stock <= 5) {
                stockClass = "low-stock";
                stockText = `Only ${product.stock} left`;
            }
            else if (product.stock <= 10) {
                stockClass = "warning-stock";
                stockText = `${product.stock} in stock`;
            }

            return `
                <article
                    class="product"
                    data-id="${product.id}">

                    <div class="product-img">
                        ${product.emoji}
                    </div>

                    <h3>
                        ${product.name}
                    </h3>

                    <small>
                        ${product.category}
                    </small>

                    <div class="product-bottom">

                        <div class="price">
                            ${money(product.price)}
                        </div>

                        <div class="stock ${stockClass}">
                            ${stockText}
                        </div>

                    </div>

                </article>
            `;

        })
        .join("");


    document.querySelectorAll(".product").forEach(card => {

        card.addEventListener("click", () => {

            const productId = Number(card.dataset.id);

            addToCart(productId);

        });

    });
}


/* =========================
   ADD PRODUCT
========================= */

function changeQty(productId, amount) {

    if (amount > 0) {

        const success =
            Cart.increase(productId);

        if (!success) {

            toast("⚠ Maximum stock reached");

            return;
        }

    } else {

        Cart.decrease(productId);

    }


    renderCart();
}


/* =========================
   CHANGE QUANTITY
========================= */

function changeQty(productId, amount) {

    const item =
        state.cart.find(product => product.id === productId);

    if (!item) {
        return;
    }


    const newQuantity =
        item.qty + amount;


    if (newQuantity > item.stock) {

        toast("⚠ Maximum available stock reached");

        return;
    }


    if (newQuantity <= 0) {

        state.cart =
            state.cart.filter(item => item.id !== productId);

    } else {

        item.qty = newQuantity;

    }


    renderCart();
}


/* =========================
   TOTAL CALCULATION
========================= */

function calculateTotals() {

    const subtotal =
        Cart.subtotal();


    let discount = 0;


    if (
        state.customer &&
        state.customer.tier === "Gold" &&
        subtotal >= 3000
    ) {

        discount =
            Math.round(subtotal * 0.05);

    }


    return {

        subtotal,

        discount,

        total:
            subtotal - discount

    };
}

/* =========================
   CART
========================= */

function renderCart() {

    const {
        subtotal,
        discount,
        total
    } = calculateTotals();


    const itemCount =
        Cart.items.reduce(
            (count, item) =>
                count + item.qty,
            0
        );


    $("itemCount").textContent =
        `${itemCount} item${itemCount !== 1 ? "s" : ""}`;


    $("subtotal").textContent =
        money(subtotal);


    $("discount").textContent =
        `− ${money(discount)}`;


    $("total").textContent =
        money(total);


    if (Cart.items.length === 0) {

        $("cartItems").innerHTML = `
            <div class="empty">

                <div>🛒</div>

                <b>Your cart is empty</b>

                <span>
                    Scan or select a product to begin
                </span>

            </div>
        `;

        return;
    }


    $("cartItems").innerHTML =
        Cart.items.map(item => `

            <div class="cart-row">

                <div class="cart-icon">
                    ${item.emoji}
                </div>


                <div>

                    <h4>
                        ${item.name}
                    </h4>

                    <small>
                        ${money(item.price)}
                        / ${item.unit}
                    </small>


                    <div class="qty">

                        <button
                            onclick="changeQty(${item.id}, -1)">
                            −
                        </button>

                        <b>
                            ${item.qty}
                        </b>

                        <button
                            onclick="changeQty(${item.id}, 1)">
                            +
                        </button>

                    </div>

                </div>


                <div class="row-price">

                    ${money(
                        item.price * item.qty
                    )}

                </div>

            </div>

        `).join("");
}


/* =========================
   CUSTOMER
========================= */

$("customerBtn").addEventListener("click", () => {

    state.customer = {
        id: "CUS-001",
        name: "Nimal Perera",
        tier: "Gold",
        points: 8450
    };


    $("customerCard").classList.remove("hidden");

    $("customerBtn").classList.add("hidden");


    renderCustomer();

    renderCart();

    toast("Gold member added");
});


function renderCustomer() {

    if (!state.customer) {
        return;
    }


    $("customerCard").innerHTML = `

        <div>

            <b>
                ${state.customer.name}
            </b>

            <small>
                ${state.customer.tier}
                Member ·
                ${state.customer.points.toLocaleString()}
                pts
            </small>

        </div>

        <button id="removeCustomer">
            ×
        </button>

    `;


    $("removeCustomer").addEventListener("click", removeCustomer);
}


function removeCustomer() {

    state.customer = null;

    $("customerCard").classList.add("hidden");

    $("customerBtn").classList.remove("hidden");

    renderCart();
}


/* =========================
   SEARCH
========================= */

$("searchInput").addEventListener(
    "input",
    renderProducts
);


/*
    Barcode scanner support.

    Most USB barcode scanners behave
    like a keyboard and type the barcode
    followed by ENTER.
*/

$("searchInput").addEventListener(
    "keydown",
    event => {

        if (event.key !== "Enter") {
            return;
        }


        const barcode =
            $("searchInput").value.trim();


        const product =
            PRODUCTS.find(
                item => item.barcode === barcode
            );


        if (!product) {

            toast("❌ Product barcode not found");

            return;
        }


        addToCart(product.id);

        $("searchInput").value = "";

        renderProducts();

    }
);


/* =========================
   CLEAR SALE
========================= */

$("clearBtn").addEventListener(
    "click",
    () => {

        if (Cart.isEmpty()) {

            toast("Nothing to clear");

            return;
        }


        if (
            !confirm(
                "Clear current sale?"
            )
        ) {
            return;
        }


        Cart.clear();

        renderCart();

        toast("Sale cleared");

    }
);


/* =========================
   HOLD SALE
========================= */

$("holdBtn").addEventListener(
    "click",
    () => {

       if (Cart.isEmpty()) {

            toast("Nothing to hold");

            return;
        }


        toast("Sale held successfully");

    }
);


/* =========================
   PAYMENT
========================= */

$("payBtn").addEventListener(
    "click",
    () => {

        if (Cart.isEmpty()) {

            toast(
                "Add products before payment"
            );

            return;
        }


        const totals =
            calculateTotals();


        $("paymentAmount").textContent =
            `Total: ${money(totals.total)}`;


        $("paymentModal")
            .classList
            .remove("hidden");

    }
);


$("closePayment").addEventListener(
    "click",
    () => {

        $("paymentModal")
            .classList
            .add("hidden");

    }
);


/* =========================
   PAYMENT METHODS
========================= */

document
    .querySelectorAll(".payment-methods button")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".payment-methods button"
                    )
                    .forEach(item =>
                        item.classList.remove(
                            "selected"
                        )
                    );


                button.classList.add("selected");


                state.paymentMethod =
                    button.dataset.method;


                $("cashArea")
                    .classList
                    .toggle(
                        "hidden",
                        state.paymentMethod !== "Cash"
                    );

            }
        );

    });


/* =========================
   CASH CALCULATION
========================= */

$("cashInput").addEventListener(
    "input",
    () => {

        const cash =
            Number($("cashInput").value) || 0;


        const total =
            calculateTotals().total;


        const change =
            Math.max(
                0,
                cash - total
            );


        $("change").textContent =
            money(change);

    }
);


/* =========================
   COMPLETE SALE
========================= */

$("completeBtn").addEventListener(
    "click",
    () => {

        const totals =
            calculateTotals();


        const received =
            Number(
                $("cashInput").value
            ) || 0;


        const validation =
            Payments.validate(
                state.paymentMethod,
                totals.total,
                received
            );


        if (!validation.valid) {

            toast(
                validation.message
            );

            return;
        }


        /*
            Create receipt before
            clearing the cart.
        */

        const receipt =
            Receipt.create(
                Cart.items,
                state.customer,
                state.paymentMethod,
                totals
            );


        /*
            Reduce inventory.
        */

        Cart.items.forEach(item => {

            const product =
                PRODUCTS.find(
                    product =>
                        product.id === item.id
                );


            if (product) {

                product.stock -= item.qty;

            }

        });


        /*
            Save last receipt.
        */

        Storage.save(
            "lastReceipt",
            receipt
        );


        /*
            Save transaction history.
        */

        const transactions =
            Storage.get(
                "transactions",
                []
            );


        transactions.push(receipt);


        Storage.save(
            "transactions",
            transactions
        );


        /*
            Print receipt.
        */

        Receipt.print(receipt);


        /*
            Reset POS.
        */

        Cart.clear();

        state.customer = null;

        state.paymentMethod = null;


        $("paymentModal")
            .classList
            .add("hidden");


        $("customerCard")
            .classList
            .add("hidden");


        $("customerBtn")
            .classList
            .remove("hidden");


        $("cashInput").value = "";

        $("change").textContent =
            money(0);


        document
            .querySelectorAll(
                ".payment-methods button"
            )
            .forEach(button =>
                button.classList.remove(
                    "selected"
                )
            );


        renderProducts();

        renderCart();


        toast(
            `✓ ${receipt.invoiceNumber} completed`
        );

    }
);


/* =========================
   KEYBOARD SHORTCUTS
========================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.ctrlKey &&
            event.key.toLowerCase() === "k"
        ) {

            event.preventDefault();

            $("searchInput").focus();

        }


        if (event.key === "F2") {

            event.preventDefault();

            $("searchInput").focus();

        }


        if (event.key === "F4") {

            event.preventDefault();

            $("payBtn").click();

        }


        if (event.key === "F8") {

            event.preventDefault();

            $("holdBtn").click();

        }

    }
);


/* =========================
   TOAST
========================= */

function toast(message) {

    const element =
        $("toast");


    element.textContent =
        message;


    element.classList.add(
        "show"
    );


    setTimeout(
        () => {
            element.classList.remove(
                "show"
            );
        },
        1600
    );

}


/* =========================
   START APPLICATION
========================= */

renderCategories();

renderProducts();

renderCart();