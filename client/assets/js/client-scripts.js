// Menu data for Maale Restaurant
const menuData = [
    { id: 1, name: "Jollof Rice", price: 2500, category: "rice", img: "assets/images/jollof.jpg" },
    { id: 2, name: "Grilled Chicken", price: 3500, category: "meat", img: "assets/images/chicken.jpg" },
    { id: 3, name: "Fried Plantain", price: 1500, category: "side", img: "assets/images/plantain.jpg" }
];

function addToCart(item) {
    let cart = getCart();
    const found = cart.find(i => i.id === item.id);
    if (found) {
        found.qty += 1;
    } else {
        cart.push({ ...item, qty: 1 });
    }
    setCart(cart);
    alert(`${item.name} added to cart!`);
}
function getCart() {
    return JSON.parse(localStorage.getItem("cart") || "[]");
}
function setCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

document.addEventListener("DOMContentLoaded", () => {
    // Menu page
    const menuList = document.getElementById("menu-list");
    if (menuList) {
        renderMenu(menuData);
    }
    function renderMenu(data) {
        menuList.innerHTML = "";
        data.forEach(item => {
            const div = document.createElement("div");
            div.className = "item";
            div.innerHTML = `<img src="${item.img}" alt="${item.name}" style="width:100%;border-radius:8px;"><h4>${item.name}</h4><p>${item.price} FCFA</p>`;
            const btn = document.createElement("button");
            btn.textContent = "Add to Cart";
            btn.onclick = () => addToCart(item);
            div.appendChild(btn);
            menuList.appendChild(div);
        });
    }
    // Cart page
    const cartList = document.getElementById("cart-list");
    if (cartList) {
        renderCart();
    }
    function renderCart() {
        const cart = getCart();
        cartList.innerHTML = "";
        let total = 0;
        cart.forEach((item, idx) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${item.name}</td><td>${item.price} FCFA</td><td><button onclick=\"decrementQty(${idx})\">-</button> ${item.qty} <button onclick=\"incrementQty(${idx})\">+</button></td><td>${(item.price * item.qty).toFixed(2)} FCFA</td><td><button onclick=\"removeFromCart(${idx})\">Remove</button></td>`;
            cartList.appendChild(tr);
            total += item.price * item.qty;
        });
        document.getElementById("cart-total") && (document.getElementById("cart-total").textContent = total.toFixed(2));
    }
    window.incrementQty = function(idx) {
        let cart = getCart();
        cart[idx].qty += 1;
        setCart(cart);
        renderCart();
    };
    window.decrementQty = function(idx) {
        let cart = getCart();
        if (cart[idx].qty > 1) cart[idx].qty -= 1;
        setCart(cart);
        renderCart();
    };
    window.removeFromCart = function(idx) {
        let cart = getCart();
        cart.splice(idx, 1);
        setCart(cart);
        renderCart();
    };
    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) {
        checkoutBtn.onclick = () => {
            window.location.href = "checkout.html";
        };
    }
    // Checkout page
    const checkoutForm = document.getElementById("checkout-form");
    if (checkoutForm) {
        renderCheckoutSummary();
        checkoutForm.onsubmit = (e) => {
            e.preventDefault();
            const address = document.getElementById("address").value.trim();
            const phone = document.getElementById("phone").value.trim();
            if (!address || !phone) {
                document.getElementById("checkout-message").textContent = "Please fill all fields.";
                return;
            }
            // Save order
            let orders = JSON.parse(localStorage.getItem('orders') || '[]');
            let cart = getCart();
            let user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
            orders.push({
                name: user.name || 'Guest',
                address,
                phone,
                items: cart,
                total: cart.reduce((sum, i) => sum + i.price * i.qty, 0),
                payment: 'Cash on Delivery',
                status: 'Pending',
                date: new Date().toLocaleString()
            });
            localStorage.setItem('orders', JSON.stringify(orders));
            localStorage.removeItem('cart');
            document.getElementById("checkout-message").style.color = 'green';
            document.getElementById("checkout-message").textContent = "Order placed successfully!";
            setTimeout(() => window.location.href = 'index.html', 1500);
        };
    }
    function renderCheckoutSummary() {
        const summary = document.getElementById("checkout-summary");
        const totalLabel = document.getElementById("checkout-total");
        if (!summary) return;
        const cart = getCart();
        let total = 0;
        summary.innerHTML = "";
        cart.forEach(item => {
            const li = document.createElement("li");
            li.textContent = `${item.name} - ${item.price} FCFA x ${item.qty}`;
            summary.appendChild(li);
            total += item.price * item.qty;
        });
        totalLabel && (totalLabel.textContent = total.toFixed(2));
    }
});
