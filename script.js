document.addEventListener("DOMContentLoaded", function() {
    // Fetch JSON data
    fetch('data.json')
    .then(response => response.json())
    .then(data => {
        let menuContainer = document.querySelector('.menu-items');

        function addItemToMenu(container, item) {
            let itemHTML = `
                <div class="menu-item" data-id="${item.รหัส}" data-name="${item.ชื่อ}" data-price="${item.ราคา}">
                    <img class="menu-item-image" src="${item.รูป}" width="100" height="100">
                    <span class="menu-item-title">${item.ชื่อ}</span>
                    <span class="menu-item-price">THB ${item.ราคา}</span>
                </div>
            `;
            container.innerHTML += itemHTML;
        }

        data.forEach(item => {
            addItemToMenu(menuContainer, item); 
        });

        // Add event listener to menu items for adding to cart
        menuContainer.querySelectorAll('.menu-item').forEach(menuItem => {
            menuItem.addEventListener('click', function() {
                addToCart(menuItem.dataset.id, menuItem.dataset.name, parseFloat(menuItem.dataset.price));
            });
        });
    });

    // Function to add item to cart
    function addToCart(id, name, price) {
        let existingCartItem = document.querySelector(`.cart-item[data-id="${id}"]`);

        if (existingCartItem) {
            let quantity = parseInt(existingCartItem.querySelector('.cart-item-quantity').textContent);
            existingCartItem.querySelector('.cart-item-quantity').textContent = quantity + 1;
        } else {
            let cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.dataset.id = id;
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <span class="cart-item-title">${name}</span>
                    <span class="cart-item-price">THB ${price.toFixed(2)}</span>
                </div>
                <div class="cart-item-actions">
                    <button class="remove-from-cart-btn">-</button>
                    <span class="cart-item-quantity">1</span>
                    <button class="add-to-cart-btn">+</button>
                </div>
            `;
            document.getElementById('cart-items').appendChild(cartItem);
        }

        updateCartSummary();
    }

    
    
    // Function to update cart summary
    function updateCartSummary() {
        let itemCount = document.querySelectorAll('.cart-item').length;
        let totalPrice = 0;
        document.getElementById('cart-items-count').textContent = itemCount;
        document.querySelectorAll('.cart-item').forEach(item => {
            totalPrice += parseFloat(item.querySelector('.cart-item-price').textContent.replace('THB ', '')) * parseInt(item.querySelector('.cart-item-quantity').textContent);
        });
    
        document.getElementById('summary-grand-total').textContent = `THB ${totalPrice.toFixed(2)}`;
    }

    document.getElementById('cart-items').addEventListener('click', function(event) {
        if (event.target.classList.contains('add-to-cart-btn')) {
            let cartItem = event.target.closest('.cart-item');
            let quantity = parseInt(cartItem.querySelector('.cart-item-quantity').textContent);
            cartItem.querySelector('.cart-item-quantity').textContent = quantity + 1;
            updateCartSummary();
        } else if (event.target.classList.contains('remove-from-cart-btn')) {
            let cartItem = event.target.closest('.cart-item');
            let quantity = parseInt(cartItem.querySelector('.cart-item-quantity').textContent);
            if (quantity > 1) {
                cartItem.querySelector('.cart-item-quantity').textContent = quantity - 1;
            } else {
                cartItem.remove();
            }
            updateCartSummary();
        }
    });
});

document.getElementById("createPDFButton").addEventListener("click", function() {
    // Capture the receipt container element
    const receiptContainer = document.getElementById("cart");
    // Use dom-to-image to convert the receipt container to an image
    domtoimage.toBlob(receiptContainer)
        .then(function(blob) {
            // Save the image as a file using FileSaver.js
            saveAs(blob, "shopping.png");
        });
  });