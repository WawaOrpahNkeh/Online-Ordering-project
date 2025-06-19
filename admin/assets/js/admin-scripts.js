// Admin product management
document.addEventListener("DOMContentLoaded", () => {
    // Dashboard stats and recent orders
    const statProducts = document.getElementById("stat-products");
    const statOrders = document.getElementById("stat-orders");
    const statCustomers = document.getElementById("stat-customers");
    const statRevenue = document.getElementById("stat-revenue");
    const dashboardRecentOrders = document.getElementById("dashboard-recent-orders");
    if (statProducts || statOrders || statCustomers || statRevenue || dashboardRecentOrders) {
        let foods = JSON.parse(localStorage.getItem('admin-foods') || '[]');
        let orders = JSON.parse(localStorage.getItem('orders') || '[]');
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        let revenue = orders.filter(o => o.status === 'Completed').reduce((sum, o) => sum + o.total, 0);
        if (statProducts) statProducts.textContent = foods.length;
        if (statOrders) statOrders.textContent = orders.length;
        if (statCustomers) statCustomers.textContent = users.length;
        if (statRevenue) statRevenue.textContent = revenue;
        if (dashboardRecentOrders) {
            dashboardRecentOrders.innerHTML = '';
            orders.slice(-5).reverse().forEach((order, idx) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td>${orders.length - idx}</td><td>${order.name}</td><td>${order.total} FCFA</td><td>${order.status}</td><td>${order.date || ''}</td>`;
                dashboardRecentOrders.appendChild(tr);
            });
        }
    }

    // Product management
    const productList = document.getElementById("product-list");
    const addProductForm = document.getElementById("add-product-form");
    let products = JSON.parse(localStorage.getItem("admin-products") || "[]");

    function renderProducts() {
        if (productList) {
            productList.innerHTML = "";
            products.forEach((product, idx) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `<td>${product.name}</td><td>${product.price} FCFA</td><td><button onclick="deleteProduct(${idx})">Delete</button></td>`;
                productList.appendChild(tr);
            });
        }
    }
    window.deleteProduct = function(idx) {
        products.splice(idx, 1);
        localStorage.setItem("admin-products", JSON.stringify(products));
        renderProducts();
    };
    if (addProductForm) {
        addProductForm.onsubmit = (e) => {
            e.preventDefault();
            const name = document.getElementById("product-name").value;
            const price = document.getElementById("product-price").value;
            products.push({ name, price });
            localStorage.setItem("admin-products", JSON.stringify(products));
            renderProducts();
            addProductForm.reset();
        };
    }
    renderProducts();

    // Food Management
    const foodList = document.getElementById('food-list');
    const foodForm = document.getElementById('food-form');
    const foodId = document.getElementById('food-id');
    const foodName = document.getElementById('food-name');
    const foodPrice = document.getElementById('food-price');
    const foodCategory = document.getElementById('food-category');
    const foodCancel = document.getElementById('food-cancel');
    let foods = JSON.parse(localStorage.getItem('admin-foods') || '[]');
    function renderFoods() {
        if (foodList) {
            foodList.innerHTML = '';
            foods.forEach((food, idx) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td>${food.name}</td><td>${food.price} FCFA</td><td>${food.category}</td><td><button onclick="editFood(${idx})">Edit</button> <button onclick="deleteFood(${idx})">Delete</button></td>`;
                foodList.appendChild(tr);
            });
        }
    }
    window.editFood = function(idx) {
        foodId.value = idx;
        foodName.value = foods[idx].name;
        foodPrice.value = foods[idx].price;
        foodCategory.value = foods[idx].category;
        foodCancel.style.display = 'inline';
    };
    window.deleteFood = function(idx) {
        foods.splice(idx, 1);
        localStorage.setItem('admin-foods', JSON.stringify(foods));
        renderFoods();
    };
    if (foodForm) {
        foodForm.onsubmit = function(e) {
            e.preventDefault();
            const name = foodName.value.trim();
            const price = foodPrice.value;
            const category = foodCategory.value.trim();
            if (foodId.value) {
                foods[foodId.value] = { name, price, category };
            } else {
                foods.push({ name, price, category });
            }
            localStorage.setItem('admin-foods', JSON.stringify(foods));
            renderFoods();
            foodForm.reset();
            foodId.value = '';
            foodCancel.style.display = 'none';
        };
        foodCancel.onclick = function() {
            foodForm.reset();
            foodId.value = '';
            foodCancel.style.display = 'none';
        };
    }
    renderFoods();

    // Customer Management
    const customerList = document.getElementById('customer-list');
    if (customerList) {
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        customerList.innerHTML = '';
        users.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${user.name}</td><td>${user.email}</td>`;
            customerList.appendChild(tr);
        });
    }

    // Order Management
    const orderList = document.getElementById('order-list');
    if (orderList) {
        let orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orderList.innerHTML = '';
        orders.forEach((order, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${idx + 1}</td><td>${order.name}</td><td>${order.address}</td><td>${order.phone}</td><td>${order.total} FCFA</td><td><select onchange="updateOrderStatus(${idx}, this.value)"><option${order.status==='Pending'?' selected':''}>Pending</option><option${order.status==='Completed'?' selected':''}>Completed</option><option${order.status==='Cancelled'?' selected':''}>Cancelled</option></select></td><td></td>`;
            orderList.appendChild(tr);
        });
    }
    window.updateOrderStatus = function(idx, status) {
        let orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders[idx].status = status;
        localStorage.setItem('orders', JSON.stringify(orders));
        location.reload();
    };

    // Payments
    const paymentList = document.getElementById('payment-list');
    if (paymentList) {
        let orders = JSON.parse(localStorage.getItem('orders') || '[]');
        paymentList.innerHTML = '';
        orders.forEach((order, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${idx + 1}</td><td>${order.name}</td><td>${order.total} FCFA</td><td>${order.payment}</td><td>${order.status}</td>`;
            paymentList.appendChild(tr);
        });
    }

    // Reports
    const reportContent = document.getElementById('report-content');
    if (reportContent) {
        let orders = JSON.parse(localStorage.getItem('orders') || '[]');
        let totalOrders = orders.length;
        let completed = orders.filter(o => o.status === 'Completed').length;
        let pending = orders.filter(o => o.status === 'Pending').length;
        let cancelled = orders.filter(o => o.status === 'Cancelled').length;
        let totalRevenue = orders.filter(o => o.status === 'Completed').reduce((sum, o) => sum + o.total, 0);
        reportContent.innerHTML = `<h3>Order Summary</h3><ul><li>Total Orders: ${totalOrders}</li><li>Completed: ${completed}</li><li>Pending: ${pending}</li><li>Cancelled: ${cancelled}</li><li>Total Revenue: ${totalRevenue} FCFA</li></ul>`;
    }
});
