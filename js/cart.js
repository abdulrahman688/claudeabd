/**
 * ZENOBIA'S LEGACY - Shopping Cart
 * Handles all shopping cart functionality with LocalStorage persistence
 */

// ===========================================
// CART STATE
// ===========================================

let cart = {
    items: [],
    total: 0
};

// ===========================================
// INITIALIZATION
// ===========================================

document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    initCartUI();
    initAddToCartButtons();
    updateCartUI();
});

// ===========================================
// CART MANAGEMENT
// ===========================================

function loadCart() {
    const savedCart = localStorage.getItem('zenobiaCart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
            calculateTotal();
        } catch (e) {
            console.error('Error loading cart:', e);
            cart = { items: [], total: 0 };
        }
    }
}

function saveCart() {
    localStorage.setItem('zenobiaCart', JSON.stringify(cart));
}

function addToCart(productId, quantity = 1) {
    const product = window.PRODUCTS[productId];

    if (!product) {
        console.error('Product not found:', productId);
        return;
    }

    // Check if item already in cart
    const existingItem = cart.items.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.items.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }

    calculateTotal();
    saveCart();
    updateCartUI();
    showCartSidebar();

    // Show success message
    if (window.zenobiaApp && window.zenobiaApp.showMessage) {
        window.zenobiaApp.showMessage(`${product.name} added to cart!`, 'success');
    }
}

function removeFromCart(productId) {
    cart.items = cart.items.filter(item => item.id !== productId);
    calculateTotal();
    saveCart();
    updateCartUI();
}

function updateQuantity(productId, newQuantity) {
    const item = cart.items.find(item => item.id === productId);

    if (!item) return;

    if (newQuantity <= 0) {
        removeFromCart(productId);
    } else {
        item.quantity = newQuantity;
        calculateTotal();
        saveCart();
        updateCartUI();
    }
}

function clearCart() {
    cart = { items: [], total: 0 };
    saveCart();
    updateCartUI();
}

function calculateTotal() {
    cart.total = cart.items.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);
}

function getCartCount() {
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}

// ===========================================
// CART UI
// ===========================================

function initCartUI() {
    const cartIcon = document.getElementById('cartIcon');
    const cartClose = document.getElementById('cartClose');
    const cartOverlay = document.getElementById('cartOverlay');
    const continueShopping = document.getElementById('continueShopping');

    if (cartIcon) {
        cartIcon.addEventListener('click', showCartSidebar);
    }

    if (cartClose) {
        cartClose.addEventListener('click', hideCartSidebar);
    }

    if (cartOverlay) {
        cartOverlay.addEventListener('click', hideCartSidebar);
    }

    if (continueShopping) {
        continueShopping.addEventListener('click', hideCartSidebar);
    }
}

function showCartSidebar() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');

    if (sidebar) {
        sidebar.classList.add('active');
    }

    if (overlay) {
        overlay.classList.add('active');
    }

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function hideCartSidebar() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');

    if (sidebar) {
        sidebar.classList.remove('active');
    }

    if (overlay) {
        overlay.classList.remove('active');
    }

    // Restore body scroll
    document.body.style.overflow = '';
}

function updateCartUI() {
    updateCartCount();
    updateCartItems();
}

function updateCartCount() {
    const cartCountEl = document.getElementById('cartCount');
    if (cartCountEl) {
        const count = getCartCount();
        cartCountEl.textContent = count;

        // Animate count change
        cartCountEl.style.transform = 'scale(1.3)';
        setTimeout(() => {
            cartCountEl.style.transform = 'scale(1)';
        }, 200);
    }
}

function updateCartItems() {
    const cartItemsEl = document.getElementById('cartItems');
    const cartFooterEl = document.getElementById('cartFooter');
    const subtotalEl = document.getElementById('subtotalAmount');

    if (!cartItemsEl) return;

    // Clear current items
    cartItemsEl.innerHTML = '';

    if (cart.items.length === 0) {
        // Show empty cart message
        cartItemsEl.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-bag"></i>
                <p>Your cart is empty</p>
                <a href="shop.html" class="btn btn-primary">Start Shopping</a>
            </div>
        `;

        // Hide footer
        if (cartFooterEl) {
            cartFooterEl.style.display = 'none';
        }
    } else {
        // Show cart items
        cart.items.forEach(item => {
            const itemEl = createCartItemElement(item);
            cartItemsEl.appendChild(itemEl);
        });

        // Show footer
        if (cartFooterEl) {
            cartFooterEl.style.display = 'block';
        }

        // Update subtotal
        if (subtotalEl) {
            subtotalEl.textContent = `€${cart.total.toFixed(2)}`;
        }
    }
}

function createCartItemElement(item) {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='images/placeholder.jpg'">
        <div class="cart-item-details">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">€${item.price.toFixed(2)}</div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">
                    <i class="fas fa-minus"></i>
                </button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${item.id})" title="Remove item">
            <i class="fas fa-trash"></i>
        </button>
    `;
    return div;
}

// ===========================================
// ADD TO CART BUTTONS
// ===========================================

function initAddToCartButtons() {
    const buttons = document.querySelectorAll('.btn-add-cart');

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = parseInt(this.getAttribute('data-product-id'));

            // Add visual feedback
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Added!';
            this.style.backgroundColor = '#6B8E23';
            this.style.borderColor = '#6B8E23';

            // Add to cart
            addToCart(productId);

            // Reset button after 1 second
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.backgroundColor = '';
                this.style.borderColor = '';
            }, 1000);
        });
    });
}

// ===========================================
// CART PAGE FUNCTIONS
// ===========================================

function renderCartPage() {
    const cartTableBody = document.getElementById('cartTableBody');
    const cartSummary = document.getElementById('cartSummary');

    if (!cartTableBody) return;

    // Clear table
    cartTableBody.innerHTML = '';

    if (cart.items.length === 0) {
        cartTableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 3rem;">
                    <i class="fas fa-shopping-bag" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                    <p style="margin-bottom: 1rem;">Your cart is empty</p>
                    <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
                </td>
            </tr>
        `;
        return;
    }

    // Render cart items
    cart.items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover;" onerror="this.src='images/placeholder.jpg'">
                    <div>
                        <strong>${item.name}</strong>
                    </div>
                </div>
            </td>
            <td>€${item.price.toFixed(2)}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span style="min-width: 30px; text-align: center;">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </td>
            <td><strong>€${(item.price * item.quantity).toFixed(2)}</strong></td>
            <td>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})" title="Remove">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        cartTableBody.appendChild(row);
    });

    // Update summary
    if (cartSummary) {
        const shipping = 5.00;
        const total = cart.total + shipping;

        cartSummary.innerHTML = `
            <h3 style="margin-bottom: 1.5rem;">Order Summary</h3>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>Subtotal:</span>
                <span>€${cart.total.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>Shipping:</span>
                <span>€${shipping.toFixed(2)}</span>
            </div>
            <hr style="margin: 1rem 0; border: none; border-top: 2px solid #D4AF37;">
            <div style="display: flex; justify-content: space-between; font-size: 1.25rem; font-weight: 700; margin-bottom: 1.5rem;">
                <span>Total:</span>
                <span style="color: #D4AF37;">€${total.toFixed(2)}</span>
            </div>
            <a href="checkout.html" class="btn btn-primary btn-block">Proceed to Checkout</a>
            <a href="shop.html" class="btn btn-secondary btn-block" style="margin-top: 0.5rem;">Continue Shopping</a>
        `;
    }
}

// ===========================================
// CHECKOUT FUNCTIONS
// ===========================================

function initCheckout() {
    renderCheckoutSummary();

    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }
}

function renderCheckoutSummary() {
    const checkoutItems = document.getElementById('checkoutItems');
    const checkoutTotal = document.getElementById('checkoutTotal');

    if (!checkoutItems) return;

    checkoutItems.innerHTML = '';

    cart.items.forEach(item => {
        const div = document.createElement('div');
        div.style.cssText = 'display: flex; justify-content: space-between; margin-bottom: 0.5rem;';
        div.innerHTML = `
            <span>${item.name} × ${item.quantity}</span>
            <span>€${(item.price * item.quantity).toFixed(2)}</span>
        `;
        checkoutItems.appendChild(div);
    });

    if (checkoutTotal) {
        const shipping = 5.00;
        const total = cart.total + shipping;
        checkoutTotal.textContent = `€${total.toFixed(2)}`;
    }
}

function handleCheckout(e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(e.target);
    const orderData = {
        customer: {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            city: formData.get('city'),
            postal: formData.get('postal'),
            country: formData.get('country')
        },
        items: cart.items,
        total: cart.total,
        orderDate: new Date().toISOString(),
        orderNumber: generateOrderNumber()
    };

    // Show loading
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<span class="loading"></span> Processing...';
    submitBtn.disabled = true;

    // Simulate order processing
    setTimeout(() => {
        // Save order to localStorage
        const orders = JSON.parse(localStorage.getItem('zenobiaOrders') || '[]');
        orders.push(orderData);
        localStorage.setItem('zenobiaOrders', JSON.stringify(orders));

        // Clear cart
        clearCart();

        // Show success message
        alert(`Order placed successfully!\nOrder Number: ${orderData.orderNumber}\n\nThank you for supporting Syrian women!`);

        // Redirect to home
        window.location.href = 'index.html';
    }, 2000);
}

function generateOrderNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ZL${timestamp}${random}`;
}

// ===========================================
// EXPOSE FUNCTIONS GLOBALLY
// ===========================================

window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;
window.renderCartPage = renderCartPage;
window.initCheckout = initCheckout;

// ===========================================
// AUTO-INIT FOR CART PAGE
// ===========================================

if (window.location.pathname.includes('cart.html')) {
    document.addEventListener('DOMContentLoaded', renderCartPage);
}

if (window.location.pathname.includes('checkout.html')) {
    document.addEventListener('DOMContentLoaded', initCheckout);
}
