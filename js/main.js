const items = document.querySelectorAll('.carousel-item');
const prev = document.getElementById('prevBtn');
const next = document.getElementById('nextBtn');
let current = 0;
let interval;

// Variables globales para productos y filtros
let todosLosProductos = [];
let categoriaActiva = 'todos';
let pedidosRealizados = []; // Nueva variable para almacenar pedidos realizados

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

if (next) {
    next.addEventListener('click', () => {
        nextSlide();
        resetInterval();
    });
}

if (prev) {
    prev.addEventListener('click', () => {
        prevSlide();
        resetInterval();
    });
}

function resetInterval() {
    clearInterval(interval);
    interval = setInterval(nextSlide, 5000);
}

// Iniciar carrusel automático solo si hay elementos
if (items.length > 0) {
    interval = setInterval(nextSlide, 5000);
}

// Configuración del carrito
const carritoPanel = document.getElementById('carrito');
const cerrarCarrito = document.getElementById('cerrarCarrito');
const carritoBoton = document.querySelector('a[href="#"] i.ph-shopping-cart')?.closest('a');

// Configuración del modal de login
const cuentaBoton = document.querySelector('a[href="#"] i.ph-user-circle')?.closest('a');
const modalLogin = document.getElementById('modal-login');
const cerrarModal = document.getElementById('cerrar-modal');
const overlay = document.getElementById('overlay-modal');

if (cerrarCarrito) {
    cerrarCarrito.addEventListener('click', () => {
        carritoPanel.classList.add('translate-x-full');
    });
}

carritoBoton?.addEventListener('click', (e) => {
    e.preventDefault();
    carritoPanel.classList.remove('translate-x-full');
});

// Event listeners para el modal de login
cuentaBoton?.addEventListener('click', (e) => {
    e.preventDefault();
    abrirModalLogin();
});

cerrarModal?.addEventListener('click', cerrarModalLogin);
overlay?.addEventListener('click', cerrarModalLogin);

let carrito = [];

// Funciones del modal de login
function abrirModalLogin() {
    modalLogin?.classList.remove('hidden');
    modalLogin?.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function cerrarModalLogin() {
    modalLogin?.classList.add('hidden');
    modalLogin?.classList.remove('flex');
    document.body.style.overflow = 'auto';
}

// Función para manejar el login
function manejarLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email-login').value;
    const password = document.getElementById('password-login').value;

    if (email && password) {
        alert(`Bienvenido! Email: ${email}`);
        cerrarModalLogin();

        const cuentaTexto = cuentaBoton?.querySelector('span');
        if (cuentaTexto) {
            cuentaTexto.textContent = 'Mi Cuenta';
        }
    } else {
        alert('Por favor, completa todos los campos');
    }
}

// Función para alternar entre login y registro
function alternarFormulario(tipo) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');

    if (tipo === 'login') {
        loginForm?.classList.remove('hidden');
        registerForm?.classList.add('hidden');
        loginTab?.classList.add('border-b-2', 'border-red-600', 'text-red-600');
        loginTab?.classList.remove('text-gray-600');
        registerTab?.classList.remove('border-b-2', 'border-red-600', 'text-red-600');
        registerTab?.classList.add('text-gray-600');
    } else {
        registerForm?.classList.remove('hidden');
        loginForm?.classList.add('hidden');
        registerTab?.classList.add('border-b-2', 'border-red-600', 'text-red-600');
        registerTab?.classList.remove('text-gray-600');
        loginTab?.classList.remove('border-b-2', 'border-red-600', 'text-red-600');
        loginTab?.classList.add('text-gray-600');
    }
}

// Función para manejar el registro
function manejarRegistro(event) {
    event.preventDefault();
    const nombre = document.getElementById('nombre-registro').value;
    const email = document.getElementById('email-registro').value;
    const password = document.getElementById('password-registro').value;
    const confirmarPassword = document.getElementById('confirmar-password').value;

    if (nombre && email && password && confirmarPassword) {
        if (password === confirmarPassword) {
            alert(`¡Registro exitoso! Bienvenido ${nombre}`);
            cerrarModalLogin();
        } else {
            alert('Las contraseñas no coinciden');
        }
    } else {
        alert('Por favor, completa todos los campos');
    }
}

// Nueva función para crear el modal de confirmación de compra
function crearModalConfirmacion() {
    // Verificar si el modal ya existe
    if (document.getElementById('modal-confirmacion')) {
        return;
    }

    const modalHTML = `
    <div id="modal-confirmacion" class="fixed inset-0 z-50 hidden items-center justify-center">
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black bg-opacity-50"></div>
        
        <!-- Modal Container -->
        <div class="relative bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <!-- Header -->
            <div class="flex items-center justify-center p-6 border-b bg-red-600 text-white">
                <div class="text-center">
                    <i class="ph ph-shopping-cart text-3xl mb-2"></i>
                    <h2 class="text-xl font-semibold">Confirmar Compra</h2>
                </div>
            </div>

            <!-- Content -->
            <div class="p-6">
                <div class="text-center mb-6">
                    <p class="text-gray-700 mb-4">¿Estás seguro de que deseas finalizar tu compra?</p>
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <p class="text-sm text-gray-600 mb-2">Resumen de tu pedido:</p>
                        <p class="text-lg font-bold text-red-600" id="total-confirmacion">COP 0.00</p>
                        <p class="text-sm text-gray-500" id="items-confirmacion">0 productos</p>
                    </div>
                </div>

                <!-- Buttons -->
                <div class="flex flex-col gap-3">
                    <button id="confirmar-compra" 
                            class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition duration-200 flex items-center justify-center gap-2">
                        <i class="ph ph-check-circle text-lg"></i>
                        Confirmar Compra
                    </button>
                    <button id="cancelar-compra" 
                            class="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center gap-2">
                        <i class="ph ph-x-circle text-lg"></i>
                        Seguir Comprando
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Agregar event listeners
    const modalConfirmacion = document.getElementById('modal-confirmacion');
    const btnConfirmar = document.getElementById('confirmar-compra');
    const btnCancelar = document.getElementById('cancelar-compra');

    btnConfirmar.addEventListener('click', confirmarCompra);
    btnCancelar.addEventListener('click', cerrarModalConfirmacion);

    // Cerrar modal al hacer clic en el overlay
    modalConfirmacion.addEventListener('click', (e) => {
        if (e.target === modalConfirmacion) {
            cerrarModalConfirmacion();
        }
    });
}

// Función para abrir el modal de confirmación
function abrirModalConfirmacion() {
    if (carrito.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }

    crearModalConfirmacion();
    
    const modal = document.getElementById('modal-confirmacion');
    const totalConfirmacion = document.getElementById('total-confirmacion');
    const itemsConfirmacion = document.getElementById('items-confirmacion');
    
    // Actualizar información del pedido
    const total = calcularTotal();
    const totalItems = carrito.reduce((sum, prod) => sum + prod.cantidad, 0);
    
    totalConfirmacion.textContent = `COP ${total}`;
    itemsConfirmacion.textContent = `${totalItems} producto${totalItems !== 1 ? 's' : ''}`;
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

// Función para cerrar el modal de confirmación
function cerrarModalConfirmacion() {
    const modal = document.getElementById('modal-confirmacion');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto';
}

// Función para confirmar la compra
function confirmarCompra() {
    // Agregar productos del carrito a pedidos realizados
    const nuevoPedido = {
        id: Date.now(),
        fecha: new Date().toLocaleDateString(),
        productos: [...carrito],
        total: parseFloat(calcularTotal())
    };
    
    pedidosRealizados.push(nuevoPedido);
    
    // Limpiar carrito
    carrito = [];
    
    // Guardar cambios en localStorage
    guardarCarritoEnStorage();
    guardarPedidosEnStorage();
    
    // Actualizar interfaces
    renderizarCarrito();
    
    // Cerrar modal
    cerrarModalConfirmacion();
    
    // Cerrar carrito lateral
    carritoPanel.classList.add('translate-x-full');
    
    // Mostrar mensaje de éxito
    alert('¡Gracias por su compra! Su pedido ha sido procesado exitosamente.');
}

// Función para guardar pedidos en localStorage
function guardarPedidosEnStorage() {
    try {
        localStorage.setItem('pedidosRealizados', JSON.stringify(pedidosRealizados));
    } catch (error) {
        console.error('Error al guardar pedidos:', error);
    }
}

// Función para cargar pedidos desde localStorage
function cargarPedidosDesdeStorage() {
    try {
        const data = localStorage.getItem('pedidosRealizados');
        if (data) {
            pedidosRealizados = JSON.parse(data);
        }
    } catch (error) {
        console.error('Error al cargar pedidos:', error);
        pedidosRealizados = [];
    }
}

// Funciones del carrito
function cargarCarritoDesdeStorage() {
    try {
        const data = localStorage.getItem('carrito');
        if (data) {
            carrito = JSON.parse(data);
            renderizarCarrito();
        } else {
            actualizarContadorCarrito();
        }
    } catch (error) {
        console.error('Error al cargar carrito:', error);
        carrito = [];
        actualizarContadorCarrito();
    }
}

function guardarCarritoEnStorage() {
    try {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    } catch (error) {
        console.error('Error al guardar carrito:', error);
    }
}

function calcularTotal() {
    return carrito.reduce((total, prod) => total + prod.price * prod.cantidad, 0).toFixed(2);
}

function actualizarContadorCarrito() {
    const contador = document.querySelector('.absolute.-top-1.-right-2');
    const totalItems = carrito.reduce((total, prod) => total + prod.cantidad, 0);

    if (contador) {
        contador.textContent = totalItems;
    }
}

function renderizarCarrito() {
    const contenedor = document.getElementById('items-carrito');
    const totalTexto = document.getElementById('total-carrito');

    if (!contenedor || !totalTexto) return;

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

function eliminarDelCarrito(id) {
    carrito = carrito.filter(prod => prod.id !== id);
    guardarCarritoEnStorage();
    renderizarCarrito();
}

// Función para filtrar productos por categoría
function filtrarPorCategoria(categoria) {
    categoriaActiva = categoria;

    document.getElementById('mis-pedidos')?.classList.add('hidden');
    document.getElementById('productos')?.classList.remove('hidden');

    // Actualizar título según la categoría
    const titulo = document.getElementById('titulo-productos');
    const titulos = {
        'todos': 'Productos Destacados',
        'electronics': 'Productos de Electrónica',
        'jewelery': 'Productos de Joyería',
        "men's clothing": 'Ropa para Hombre',
        "women's clothing": 'Ropa para Mujer',
        'destacados': 'Productos Destacados (4+ Estrellas)'
    };

    if (titulo) {
        titulo.textContent = titulos[categoria] || 'Productos Destacados';
    }

    // Filtrar y mostrar productos
    mostrarProductos(todosLosProductos, categoria);

    // Prevenir navegación del enlace
    if (event) {
        event.preventDefault();
    }
    return false;
}

// Función para mostrar productos destacados (4+ estrellas)
function mostrarProductosDestacados() {
    categoriaActiva = 'destacados';
    filtrarPorCategoria('destacados');
}

// Función para mostrar productos (filtrados o todos)
function mostrarProductos(productos, categoria = 'todos') {
    const contenedor = document.getElementById('lista-productos');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    // Filtrar productos según la categoría
    let productosFiltrados;

    if (categoria === 'todos') {
        productosFiltrados = productos;
    } else if (categoria === 'destacados') {
        // Filtrar productos con rating >= 4.0
        productosFiltrados = productos.filter(producto => producto.rating.rate >= 4.0);
    } else {
        productosFiltrados = productos.filter(producto => producto.category === categoria);
    }

    if (productosFiltrados.length === 0) {
        const mensaje = categoria === 'destacados'
            ? 'No se encontraron productos destacados (4+ estrellas).'
            : 'No se encontraron productos en esta categoría.';
        contenedor.innerHTML = `<p class="text-gray-500 col-span-full text-center">${mensaje}</p>`;
        return;
    }

    // Ordenar productos destacados por rating descendente
    if (categoria === 'destacados') {
        productosFiltrados.sort((a, b) => b.rating.rate - a.rating.rate);
    }

    productosFiltrados.forEach(producto => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'bg-white rounded-lg shadow-md p-4 flex flex-col hover:shadow-lg transition';

        // Agregar badge para productos destacados
        const badgeDestacado = categoria === 'destacados'
            ? '<div class="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">⭐ DESTACADO</div>'
            : '';

        tarjeta.innerHTML = `
          <div class="relative">
            ${badgeDestacado}
            <img src="${producto.image}" alt="${producto.title}" class="h-40 w-full object-contain mb-4">
          </div>
          <h3 class="text-sm font-semibold mb-1 line-clamp-2">${producto.title}</h3>
          <p class="text-lg font-bold text-gray-800 mb-2">💲${producto.price.toFixed(2)}</p>
          <div class="flex items-center text-yellow-500 mb-2">
            ${'★'.repeat(Math.round(producto.rating.rate))}<span class="ml-1 text-sm text-gray-600">(${producto.rating.count}) - ${producto.rating.rate.toFixed(1)} ⭐</span>
          </div>
          <p class="text-xs text-gray-500 mb-4 capitalize">${producto.category}</p>
          <button class="btn-carrito mt-auto bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm font-semibold" data-id="${producto.id}">
            Agregar al carrito
          </button>
        `;

        contenedor.appendChild(tarjeta);
    });

    // Reactivar botones del carrito
    activarBotonesCarrito(productos);

    // Mostrar información adicional para productos destacados
    if (categoria === 'destacados') {
        const infoDiv = document.createElement('div');
        infoDiv.className = 'col-span-full bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4';
        infoDiv.innerHTML = `
            <div class="flex items-center gap-2 text-yellow-800">
                <i class="ph ph-star text-xl"></i>
                <span class="font-semibold">Productos Destacados</span>
            </div>
            <p class="text-sm text-yellow-700 mt-1">
                Mostrando ${productosFiltrados.length} productos con calificación de 4.0 estrellas o superior, ordenados por mejor puntuación.
            </p>
        `;
        contenedor.insertBefore(infoDiv, contenedor.firstChild);
    }
}

// Función para cargar productos desde la API
async function cargarProductos() {
    try {
        const res = await fetch('https://fakestoreapi.com/products');
        const productos = await res.json();

        // Guardar todos los productos para filtrado
        todosLosProductos = productos;

        // Mostrar productos iniciales
        mostrarProductos(productos, categoriaActiva);

    } catch (error) {
        console.error('Error al cargar productos:', error);
        const contenedor = document.getElementById('lista-productos');
        if (contenedor) {
            contenedor.innerHTML = `<p class="text-red-500 col-span-full text-center">Error al cargar los productos. Por favor, recarga la página.</p>`;
        }
    }
}

function activarBotonesCarrito(productos) {
    const botones = document.querySelectorAll('.btn-carrito');
    botones.forEach(boton => {
        // Remover event listeners anteriores clonando el elemento
        const nuevoBoton = boton.cloneNode(true);
        boton.parentNode.replaceChild(nuevoBoton, boton);

        nuevoBoton.addEventListener('click', () => {
            const id = parseInt(nuevoBoton.getAttribute('data-id'));
            const producto = productos.find(p => p.id === id);

            if (!producto) {
                console.error('Producto no encontrado:', id);
                return;
            }

            const existente = carrito.find(p => p.id === id);

            if (existente) {
                existente.cantidad += 1;
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

            // Mostrar feedback visual
            nuevoBoton.textContent = '¡Agregado!';
            nuevoBoton.style.backgroundColor = '#10b981';
            setTimeout(() => {
                nuevoBoton.textContent = 'Agregar al carrito';
                nuevoBoton.style.backgroundColor = '';
            }, 1000);
        });
    });
}

// Función actualizada para mostrar mis pedidos
function mostrarMisPedidos() {
    const pedidosSection = document.getElementById('mis-pedidos');
    const productosSection = document.getElementById('productos');
    const pedidosLista = document.getElementById('lista-pedidos');

    if (!pedidosSection || !productosSection || !pedidosLista) {
        console.error('No se encontraron los elementos necesarios para mostrar pedidos');
        return;
    }

    pedidosSection.classList.remove('hidden');
    productosSection.classList.add('hidden');

    pedidosLista.innerHTML = ''; // Limpia contenido anterior

    if (pedidosRealizados.length === 0) {
        pedidosLista.innerHTML = `
            <div class="text-center py-8">
                <i class="ph ph-shopping-bag text-6xl text-gray-300 mb-4"></i>
                <p class="text-gray-500 text-lg">No has realizado ningún pedido aún.</p>
                <p class="text-gray-400 text-sm mt-2">Cuando realices una compra, aparecerá aquí.</p>
            </div>
        `;
        return;
    }

    // Mostrar pedidos realizados (ordenados por fecha más reciente)
    pedidosRealizados.slice().reverse().forEach(pedido => {
        const pedidoDiv = document.createElement('div');
        pedidoDiv.className = 'bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500';

        const productosHTML = pedido.productos.map(prod => `
            <div class="flex items-center gap-3 py-2 border-b border-gray-100 last:border-b-0">
                <img src="${prod.image}" alt="${prod.title}" class="w-12 h-12 object-contain rounded">
                <div class="flex-1">
                    <h4 class="font-medium text-sm">${prod.title}</h4>
                    <p class="text-xs text-gray-600">Cantidad: ${prod.cantidad} | Precio: $${prod.price.toFixed(2)}</p>
                </div>
                <div class="text-right">
                    <p class="font-semibold text-sm">$${(prod.price * prod.cantidad).toFixed(2)}</p>
                </div>
            </div>
        `).join('');

        pedidoDiv.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="font-bold text-lg text-gray-800">Pedido #${pedido.id}</h3>
                    <p class="text-sm text-gray-600">Fecha: ${pedido.fecha}</p>
                    <span class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-1">
                        ✓ Completado
                    </span>
                </div>
                <div class="text-right">
                    <p class="text-lg font-bold text-green-600">$${pedido.total.toFixed(2)}</p>
                    <p class="text-xs text-gray-500">${pedido.productos.length} producto${pedido.productos.length !== 1 ? 's' : ''}</p>
                </div>
            </div>
            <div class="space-y-2">
                ${productosHTML}
            </div>
        `;

        pedidosLista.appendChild(pedidoDiv);
    });
}

// Función para configurar el event listener del botón finalizar compra
function configurarBotonFinalizarCompra() {
    // Buscar el botón usando múltiples selectores
    const selectors = [
        'button:contains("Finalizar Compra")',
        '.border-t button',
        '#carrito .border-t button',
        'button[class*="bg-red-600"][class*="w-full"]'
    ];
    
    let finalizarCompraBtn = null;
    
    // Buscar por texto del botón
    const botones = document.querySelectorAll('button');
    botones.forEach(btn => {
        if (btn.textContent.includes('Finalizar Compra')) {
            finalizarCompraBtn = btn;
        }
    });
    
    // Si no se encontró, buscar en el carrito específicamente
    if (!finalizarCompraBtn) {
        const carritoDiv = document.getElementById('carrito');
        if (carritoDiv) {
            const botonesCarrito = carritoDiv.querySelectorAll('button');
            botonesCarrito.forEach(btn => {
                if (btn.textContent.includes('Finalizar Compra')) {
                    finalizarCompraBtn = btn;
                }
            });
        }
    }
    
    if (finalizarCompraBtn) {
        console.log('Botón Finalizar Compra encontrado:', finalizarCompraBtn);
        // Remover listeners anteriores
        finalizarCompraBtn.removeEventListener('click', abrirModalConfirmacion);
        // Agregar nuevo listener
        finalizarCompraBtn.addEventListener('click', abrirModalConfirmacion);
    } else {
        console.warn('No se pudo encontrar el botón Finalizar Compra');
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado, inicializando...');
    
    // Cargar datos
    cargarCarritoDesdeStorage();
    cargarPedidosDesdeStorage();
    cargarProductos();
    
    // Configurar botón de finalizar compra con un pequeño delay
    setTimeout(() => {
        configurarBotonFinalizarCompra();
    }, 100);
    
    console.log('Inicialización completada');
    console.log('Pedidos realizados:', pedidosRealizados);
});