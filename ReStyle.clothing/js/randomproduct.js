// Function to load products
function loadProducts(numProducts) {
    const productContainer = document.getElementById('product-container');

    fetch('js/products.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(products => {
            // Slice the array to get only the first numProducts
            const productsToShow = products.slice(0, numProducts);

            productsToShow.forEach((product, index) => {
                const { name, price, discount } = product;
                const discountedPrice = price * (1 - discount / 100);
                const imageIndex = (index % 48) + 1; // Assuming you have 45 images

                const productHTML = `
                    <div class="box">
                        <span class="discount">-${discount}%</span>
                        <div class="image">
                            <img src="images/img-${imageIndex}.jpeg" alt="${name}">
                            <div class="icons">
                                <a href="javascript:void(0);" class="fas fa-heart"></a>
                                <a href="javascript:void(0);" class="cart-btn" onclick="addToCart('${name}', ${price}, ${discount})">Add to cart</a>
                                <a href="javascript:void(0);" class="fas fa-share"></a>
                            </div>
                        </div>
                        <div class="content">
                            <h3>${name}</h3>
                            <div class="price">$${discountedPrice.toLocaleString()} <span>$${price.toLocaleString()}</span></div>
                        </div>
                    </div>
                `;
                productContainer.innerHTML += productHTML;
            });
        })
        .catch(error => console.error('Error fetching products:', error));
}

// Function to add product to cart
function addToCart(name, price, discount) {
    // Tạo đối tượng chứa thông tin sản phẩm
    const product = {
        name: name,
        price: price,
        discount: discount,
        quantity: 1 // Thiết lập số lượng ban đầu là 1
    };

    // Lấy danh sách sản phẩm từ localStorage (nếu có)
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    // Kiểm tra xem sản phẩm có trong giỏ hàng chưa
    let productFound = false;
    cartItems.forEach(item => {
        if (item.name === name) {
            // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng lên 1
            item.quantity += 1;
            productFound = true;
        }
    });
    // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới vào
    if (!productFound) {
        cartItems.push(product);
    }
    // Lưu danh sách sản phẩm vào localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    // Thông báo cho người dùng sản phẩm đã được thêm vào giỏ hàng (có thể thay bằng thông báo hoặc redirect đến trang giỏ hàng)
    showNotification(`Added product "${name}" to cart!`);
}
// Function to show notification
function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');

    // Set notification message
    notificationMessage.textContent = message;

    // Show notification
    notification.style.display = 'block';

    // Hide notification after 3 seconds (6000 milliseconds)
    setTimeout(() => {
        closeNotification();
    }, 6000);
}

// Function to close notification
function closeNotification() {
    const notification = document.getElementById('notification');
    notification.style.display = 'none';
}