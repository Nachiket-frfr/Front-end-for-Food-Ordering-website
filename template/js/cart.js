
(() => {
    const CART_KEY = "cart";

    function getCart() {
        try {
            const raw = localStorage.getItem(CART_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (err) {
            console.warn("cart.js: corrupted cart data, resetting.", err);
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        renderAll();
    }

    function addToCart(item) {
        const cart = getCart();
        const existing = cart.find((c) => c.id === item.id);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ ...item, qty: 1 });
        }
        saveCart(cart);
        showToast(`${item.name} added to cart`);
        bumpBadge();
    }

    function changeQty(id, delta) {
        let cart = getCart();
        const item = cart.find((c) => c.id === id);
        if (!item) return;
        item.qty += delta;
        if (item.qty <= 0) {
            cart = cart.filter((c) => c.id !== id);
        }
        saveCart(cart);
    }

    function removeFromCart(id) {
        const cart = getCart().filter((c) => c.id !== id);
        saveCart(cart);
    }

    function getCartTotal() {
        return getCart().reduce((sum, item) => sum + item.price * item.qty, 0);
    }

    function getCartCount() {
        return getCart().reduce((sum, item) => sum + item.qty, 0);
    }


    function renderBadge() {
        const badge = document.getElementById("cart_badge");
        if (!badge) return;
        const count = getCartCount();
        badge.textContent = count;
        badge.classList.toggle("hidden", count === 0);
    }

    function bumpBadge() {
        const badge = document.getElementById("cart_badge");
        if (!badge) return;
        badge.classList.add("bump");
        setTimeout(() => badge.classList.remove("bump"), 150);
    }

    function renderCartItems() {
        const container = document.getElementById("cart_items");
        const subtotalEl = document.getElementById("cart_subtotal");
        const checkoutBtn = document.getElementById("checkout_btn");
        if (!container) return;

        const cart = getCart();

        if (cart.length === 0) {
            container.innerHTML = `<p class="cart-empty">Your cart is empty. Add a dish to get started.</p>`;
        } else {
            container.innerHTML = cart
                .map(
                    (item) => `
                <div class="cart-row" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-row-info">
                        <p class="cart-row-name">${item.name}</p>
                        <p class="cart-row-price">₹${item.price} × ${item.qty}</p>
                    </div>
                    <div class="cart-qty">
                        <button class="cart-qty-minus" data-id="${item.id}">−</button>
                        <span>${item.qty}</span>
                        <button class="cart-qty-plus" data-id="${item.id}">+</button>
                    </div>
                    <i class="fa-solid fa-trash cart-row-remove" data-id="${item.id}" title="Remove"></i>
                </div>`
                )
                .join("");
        }

        if (subtotalEl) subtotalEl.textContent = `₹${getCartTotal()}`;
        if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;
    }

    function renderDishActions() {
        const cart = getCart();
        document.querySelectorAll(".dish-card").forEach((card) => {
            const id = card.dataset.id;
            const actionEl = card.querySelector(".dish-action");
            if (!actionEl) return;
            const inCart = cart.find((c) => c.id === id);

            if (inCart) {
                actionEl.innerHTML = `
                    <div class="dish-stepper">
                        <button class="dish-qty-minus" data-id="${id}">−</button>
                        <span>${inCart.qty}</span>
                        <button class="dish-qty-plus" data-id="${id}">+</button>
                    </div>`;
            } else {
                actionEl.innerHTML = `<button class="add-to-cart-btn" data-id="${id}">Add to Cart</button>`;
            }
        });
    }

    function renderAll() {
        renderBadge();
        renderCartItems();
        renderDishActions();
    }

    // ---------- Toast ----------

    let toastTimer = null;
    function showToast(message) {
        const toast = document.getElementById("toast");
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
    }

    // ---------- Drawer open/close ----------

    function openCart() {
        const drawer = document.getElementById("cart_drawer");
        const overlay = document.getElementById("cart_overlay");
        if (drawer) {
            drawer.classList.add("active");
            drawer.setAttribute("aria-hidden", "false");
        }
        if (overlay) overlay.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closeCart() {
        const drawer = document.getElementById("cart_drawer");
        const overlay = document.getElementById("cart_overlay");
        if (drawer) {
            drawer.classList.remove("active");
            drawer.setAttribute("aria-hidden", "true");
        }
        if (overlay) overlay.classList.remove("active");
        document.body.style.overflow = "";
    }

    // ---------- Wiring ----------

    document.addEventListener("DOMContentLoaded", () => {
        renderAll();

        document.addEventListener("click", (e) => {
            // Open / close drawer
            if (e.target.closest("#cart_toggle")) {
                openCart();
                return;
            }
            if (e.target.closest("#cart_close") || e.target.id === "cart_overlay") {
                closeCart();
                return;
            }

            // Add to cart from a dish card
            const addBtn = e.target.closest(".add-to-cart-btn");
            if (addBtn) {
                const card = addBtn.closest(".dish-card");
                addToCart({
                    id: card.dataset.id,
                    name: card.dataset.name,
                    price: Number(card.dataset.price),
                    image: card.querySelector("img").src,
                });
                return;
            }

            // Quantity steppers on dish cards
            const dishPlus = e.target.closest(".dish-qty-plus");
            if (dishPlus) {
                changeQty(dishPlus.dataset.id, 1);
                return;
            }
            const dishMinus = e.target.closest(".dish-qty-minus");
            if (dishMinus) {
                changeQty(dishMinus.dataset.id, -1);
                return;
            }

            // Quantity steppers inside the cart drawer
            const cartPlus = e.target.closest(".cart-qty-plus");
            if (cartPlus) {
                changeQty(cartPlus.dataset.id, 1);
                return;
            }
            const cartMinus = e.target.closest(".cart-qty-minus");
            if (cartMinus) {
                changeQty(cartMinus.dataset.id, -1);
                return;
            }

            // Remove from cart
            const removeBtn = e.target.closest(".cart-row-remove");
            if (removeBtn) {
                removeFromCart(removeBtn.dataset.id);
                return;
            }

            // Checkout placeholder — real flow lands with order tracking
            if (e.target.closest("#checkout_btn")) {
                showToast("Checkout flow coming with order tracking");
                return;
            }
        });

        // Keep cart in sync if it's changed in another tab
        window.addEventListener("storage", (e) => {
            if (e.key === CART_KEY) renderAll();
        });
    });
    
    window.Cart = { getCart, getCartTotal, getCartCount, addToCart, removeFromCart, changeQty };
})();
