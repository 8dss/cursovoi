
document.addEventListener('DOMContentLoaded', function () {

    fetch('xml/products.xml')
        .then(response => response.text())
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(data => {
            const productsNode = data.querySelectorAll('product');
            const container = document.querySelector('.products');

            productsNode.forEach(product => {
                const id = product.getAttribute('id');
                const name = product.querySelector('name').textContent;
                const oldPrice = product.querySelector('oldprice').textContent;
                const newPrice = product.querySelector('newprice').textContent;
                const img = product.querySelector('image').textContent;
                const alt = product.querySelector('alt').textContent;
                const features = product.querySelectorAll('feature');

                const featureList = Array.from(features).map(f => `<li>${f.textContent}</li>`).join('');

                const productHTML = `
                    <div class="product" data-id="${id}">
                        <img src="${img}" alt="${alt}">
                        <h3>${name}</h3>
                        <p>
                            <span class="old-price">${oldPrice} BYN</span>
                            <span class="new-price">${newPrice} BYN</span>
                        </p>
                        <button>Купить</button>
                        <div class="product-details">
                            <ul>${featureList}</ul>
                        </div>
                    </div>
                `;

                container.insertAdjacentHTML('beforeend', productHTML);
            });

            initAddToCart();
            initProductHover();
        });

    function addToCart(id, name, price) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let product = cart.find(item => item.id === id);
        if (product) {
            product.quantity++;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${name} добавлен в корзину!`);
    }

    function initAddToCart() {
        const productCards = document.querySelectorAll('.product');
        productCards.forEach(card => {
            const button = card.querySelector('button');
            const id = parseInt(card.dataset.id);
            const name = card.querySelector('h3').innerText;
            const priceText = card.querySelector('.new-price').innerText;
            const price = parseFloat(priceText.replace(/[^\d.]/g, ''));

            button.addEventListener('click', () => {
                addToCart(id, name, price);
            });
        });
    }

    function initProductHover() {
        const products = document.querySelectorAll('.product');
        products.forEach(product => {
            const details = product.querySelector('.product-details');
            product.addEventListener('mouseenter', () => {
                details.style.opacity = '1';
            });
            product.addEventListener('mouseleave', () => {
                details.style.opacity = '0';
            });
        });
    }
});
