    // Function to load cart items
    function loadCartItems() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalElement = document.getElementById('cart-total');

        // Lấy danh sách sản phẩm từ localStorage
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        // Kiểm tra xem giỏ hàng có sản phẩm không
        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = '<tr><td colspan="4">Your shopping cart is empty.</td></tr>';
            cartTotalElement.textContent = '$0.00'; // Thiết lập tổng tiền là 0 nếu không có sản phẩm
        } else {
            // Tạo một đối tượng để lưu trữ các sản phẩm theo tên
            let groupedProducts = {};

            // Duyệt qua danh sách sản phẩm và gộp nhóm theo tên
            cartItems.forEach(product => {
                const { name, price, discount, quantity } = product;
                const discountedPrice = price * (1 - discount / 100);
                const totalPrice = discountedPrice * quantity;

                if (groupedProducts[name]) {
                    // Nếu sản phẩm đã có trong groupedProducts, cập nhật thông tin
                    groupedProducts[name].quantity += quantity;
                    groupedProducts[name].totalPrice += totalPrice;
                } else {
                    // Nếu sản phẩm chưa có, thêm vào groupedProducts
                    groupedProducts[name] = {
                        name: name,
                        price: discountedPrice, // Giá giảm giá
                        quantity: quantity,
                        totalPrice: totalPrice
                    };
                }
            });

            // Xóa bỏ nội dung cũ trong container
            cartItemsContainer.innerHTML = '';

            // Đổ danh sách sản phẩm đã gộp vào HTML
            let cartTotal = 0;
            Object.values(groupedProducts).forEach(product => {
                const { name, price, quantity, totalPrice } = product;
                const productHTML = `
                    <tr>
                        <td class="product-name">${name}</td>
                        <td class="product-price">$${price.toLocaleString()}</td>
                        <td class="product-quantity">${quantity}</td>
                        <td class="product-total">$${totalPrice.toLocaleString()}</td>
                    </tr>
                `;
                cartItemsContainer.innerHTML += productHTML;
                cartTotal += totalPrice;
            });

            // Hiển thị tổng tiền của giỏ hàng
            cartTotalElement.textContent ='$'+ cartTotal.toLocaleString();
        }
    }

    // Gọi hàm để load các sản phẩm trong giỏ hàng khi trang được tải
    window.addEventListener('DOMContentLoaded', () => {
        loadCartItems();
    });

    document.getElementById('checkout-btn').addEventListener('click', function(event) {
        event.preventDefault(); // Ngăn chặn hành động mặc định của thẻ <a>
    
        // Lấy danh sách sản phẩm từ localStorage
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
        // Tính toán tổng giá trị đơn hàng
        let cartTotal = 0;
        cartItems.forEach(product => {
            const { price, discount, quantity } = product;
            const discountedPrice = price * (1 - discount / 100);
            const totalPrice = discountedPrice * quantity;
            cartTotal += totalPrice;
        });
    
        // Lưu tổng giá trị đơn hàng vào localStorage
        localStorage.setItem('cartTotal', cartTotal);
    
        // Lưu danh sách sản phẩm vào localStorage dưới dạng JSON để chuyển sang trang payment.html
        localStorage.setItem('checkoutItems', JSON.stringify(cartItems));
    
        // Chuyển hướng đến trang thanh toán (payment.html)
        window.location.href = 'payment.html';
    });