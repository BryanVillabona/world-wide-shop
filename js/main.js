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

// Configuración del carrito
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
    } else {
        // Si no hay carrito guardado, asegurar que el contador esté en 0
        actualizarContadorCarrito();
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

// Actualizar contador del carrito en el header
function actualizarContadorCarrito() {
    const contador = document.querySelector('.absolute.-top-1.-right-2');
    const totalItems = carrito.reduce((total, prod) => total + prod.cantidad, 0);
    
    if (contador) {
        contador.textContent = totalItems;
    }
}

// Renderizar carrito en la barra lateral
function renderizarCarrito() {
    const contenedor = document.getElementById('items-carrito');
    const totalTexto = document.getElementById('total-carrito');
    contenedor.innerHTML = '';

    if (carrito.length === 0) {
        contenedor.innerHTML = '<p class="text-gray-500">Tu carrito está vacío.</p>';
        totalTexto.textContent = 'COP 0.00';
        actualizarContadorCarrito();
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
    actualizarContadorCarrito();
}

// Eliminar producto del carrito
function eliminarDelCarrito(id) {
    carrito = carrito.filter(prod => prod.id !== id);
    guardarCarritoEnStorage();
    renderizarCarrito();
}

// Función única para cargar productos
const contenedor = document.getElementById('lista-productos');

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
          <button class="btn-carrito mt-auto bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm font-semibold" data-id="${producto.id}">
            Agregar al carrito
          </button>
        `;

            contenedor.appendChild(tarjeta);
        });

        // Activar botones
        activarBotonesCarrito(productos);
    } catch (error) {
        contenedor.innerHTML = `<p class="text-red-500">Error al cargar los productos.</p>`;
    }
}

function activarBotonesCarrito(productos) {
    const botones = document.querySelectorAll('.btn-carrito');
    botones.forEach(boton => {
        boton.addEventListener('click', () => {
            const id = parseInt(boton.getAttribute('data-id'));
            const producto = productos.find(p => p.id === id);
            const existente = carrito.find(p => p.id === id);
            
            if (existente) {
                existente.cantidad +=1;
            } else {
                carrito.push({
                    id: producto.id,
                    title: producto.title,
                    price: producto.price,
                    image: producto.image,
                    cantidad: 1
                });
            }

            guardarCarritoEnStorage();
            renderizarCarrito();
        });
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    cargarCarritoDesdeStorage();
    cargarProductos();
});