const items = document.querySelectorAll('.carousel-item');
const prev = document.getElementById('prevBtn');
const next = document.getElementById('nextBtn');
let current = 0;
let interval;

function showSlide(index) {
    items.forEach((item, i) => {
        item.classList.toggle('opacity-100', i === index);
        item.classList.toggle('opacity-0', i !== index);
    });
}

function nextSlide() {
    current = (current + 1) % items.length;
    showSlide(current);
}

function prevSlide() {
    current = (current - 1 + items.length) % items.length;
    showSlide(current);
}

next.addEventListener('click', () => {
    nextSlide();
    resetInterval();
});

prev.addEventListener('click', () => {
    prevSlide();
    resetInterval();
});

function resetInterval() {
    clearInterval(interval);
    interval = setInterval(nextSlide, 5000);
}

// Iniciar carrusel automático
interval = setInterval(nextSlide, 5000);

const contenedor = document.getElementById('lista-productos');

// Cargar productos de la API
async function cargarProductos() {
    try {
        const res = await fetch('https://fakestoreapi.com/products');
        const productos = await res.json();

        productos.forEach(producto => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'bg-white rounded-lg shadow-md p-4 flex flex-col hover:shadow-lg transition';

            tarjeta.innerHTML = `
          <img src="${producto.image}" alt="${producto.title}" class="h-40 w-full object-contain mb-4">
          <h3 class="text-sm font-semibold mb-1 line-clamp-2">${producto.title}</h3>
          <p class="text-lg font-bold text-gray-800 mb-2">💲${producto.price.toFixed(2)}</p>
          <div class="flex items-center text-yellow-500 mb-2">
            ${'★'.repeat(Math.round(producto.rating.rate))}<span class="ml-1 text-sm text-gray-600">(${producto.rating.count})</span>
          </div>
          <p class="text-xs text-gray-500 mb-4 capitalize">${producto.category}</p>
          <button class="mt-auto bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm font-semibold">
            Agregar al carrito
          </button>
        `;

            contenedor.appendChild(tarjeta);
        });
    } catch (error) {
        contenedor.innerHTML = `<p class="text-red-500">Error al cargar los productos.</p>`;
    }
}

cargarProductos();

const carritoPanel = document.getElementById('carrito');
const cerrarCarrito = document.getElementById('cerrarCarrito');
const carritoBoton = document.querySelector('a[href="#"] i.ph-shopping-cart')?.closest('a');

cerrarCarrito.addEventListener('click', () => {
    carritoPanel.classList.add('translate-x-full');
});

carritoBoton?.addEventListener('click', (e) => {
    e.preventDefault();
    carritoPanel.classList.remove('translate-x-full');
});