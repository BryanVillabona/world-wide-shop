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

let carrito = [];

// Leer carrito desde localStorage
function cargarCarritoDesdeStorage() {
    const data = localStorage.getItem('carrito');
    if (data) {
        carrito = JSON.parse(data);
        renderizarCarrito();
    }
}

// Guardar carrito en localStorage
function guardarCarritoEnStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Calcular total del carrito
function calcularTotal() {
    return carrito.reduce((total, prod) => total + prod.price * prod.cantidad, 0).toFixed(2);
}

// Renderizar carrito en la barra lateral
function renderizarCarrito() {
    const contenedor = document.getElementById('items-carrito');
    const totalTexto = document.getElementById('total-carrito');
    contenedor.innerHTML = '';

    if (carrito.length === 0) {
        contenedor.innerHTML = '<p class="text-gray-500">Tu carrito está vacío.</p>';
        totalTexto.textContent = 'COP 0.00';
        return;
    }

    carrito.forEach(prod => {
        const div = document.createElement('div');
        div.className = 'flex items-center gap-4';

        div.innerHTML = `
        <img src="${prod.image}" alt="${prod.title}" class="w-12 h-12 object-contain">
        <div class="flex-1">
          <h4 class="text-sm font-medium line-clamp-1">${prod.title}</h4>
          <p class="text-xs text-gray-600">Cant: ${prod.cantidad} | 💲${(prod.price * prod.cantidad).toFixed(2)}</p>
        </div>
        <button class="text-red-600 hover:text-red-800 font-bold" onclick="eliminarDelCarrito(${prod.id})">×</button>
      `;

        contenedor.appendChild(div);
    });

    totalTexto.textContent = `COP ${calcularTotal()}`;
}

// Eliminar producto del carrito
function eliminarDelCarrito(id) {
    carrito = carrito.filter(prod => prod.id !== id);
    guardarCarritoEnStorage();
    renderizarCarrito();
}

// Iniciar al cargar
document.addEventListener('DOMContentLoaded', cargarCarritoDesdeStorage);