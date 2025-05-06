document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('productContainerAudio');
    const storageKey = 'cart_audio';

    fetch('xml/headphones.xml')
        .then(response => response.text())
        .then(xmlText => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(xmlText, "application/xml");
            const products = xml.querySelectorAll('product');

            products.forEach(product => {
                const id = product.getAttribute('id');
                const name = product.querySelector('name').textContent;
                const price = parseFloat(product.querySelector('price').textContent);
                const image = product.querySelector('image').textContent;
                const specs = Array.from(product.querySelectorAll('details > spec'))
                    .map(s => `<li>${s.textContent}</li>`)
                    .join('');

                const productHTML = `
                    <div class="product" data-id="${id}">
                        <img src="${image}" alt="${name}">
                        <h3>${name}</h3>
                        <p>Цена: ${price} BYN</p>
                        <button>Купить</button>
                        <div class="product-details">
                            <ul>${specs}</ul>
                        </div>
                    </div>
                `;

                container.insertAdjacentHTML('beforeend', productHTML);
            });

            attachBuyHandlers(container);
        });

    document.getElementById('brandFilterAudio').addEventListener('submit', function (e) {
        e.preventDefault();

        const checkedBrands = Array.from(document.querySelectorAll('input[name="brand"]:checked'))
            .map(cb => cb.value.toLowerCase());

        const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
        const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;

        const products = container.querySelectorAll('.product');

        products.forEach(product => {
            const name = product.querySelector('h3').innerText.toLowerCase();
            const priceText = product.querySelector('p').innerText;
            const price = parseFloat(priceText.replace(/[^\d.]/g, ''));

            const matchesBrand = checkedBrands.length === 0 || checkedBrands.some(brand => name.includes(brand));
            const matchesPrice = price >= minPrice && price <= maxPrice;

            product.style.display = (matchesBrand && matchesPrice) ? 'block' : 'none';
        });
    });
});

function attachBuyHandlers(container) {
    const productCards = container.querySelectorAll('.product');
    productCards.forEach(card => {
        const button = card.querySelector('button');
        const id = parseInt(card.dataset.id);
        const name = card.querySelector('h3').innerText;
        const priceText = card.querySelector('p').innerText;
        const price = parseFloat(priceText.replace(/[^\d.]/g, ''));

        button.addEventListener('click', () => {
            addToCart(id, name, price);
        });
    });
}

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