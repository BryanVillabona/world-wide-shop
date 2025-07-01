const items = document.querySelectorAll('.carousel-item');
const prev = document.getElementById('prevBtn');
const next = document.getElementById('nextBtn');
let current = 0;
let interval;

function mostrarMensaje(texto, tipo = 'info', duracion = 2000) {
    const mensajeDiv = document.getElementById('mensaje-error');
    if (!mensajeDiv) return;

    mensajeDiv.textContent = texto;
    mensajeDiv.className = 'text-center py-2 text-sm font-medium';

    if (tipo === 'error') {
        mensajeDiv.classList.add('bg-red-100', 'text-red-700', 'border', 'border-red-300');
    } else if (tipo === 'exito') {
        mensajeDiv.classList.add('bg-green-100', 'text-green-700', 'border', 'border-green-300');
    } else {
        mensajeDiv.classList.add('bg-blue-100', 'text-blue-700', 'border', 'border-blue-300');
    }

    mensajeDiv.classList.remove('hidden');

    if (duracion > 0) {
        setTimeout(() => {
            mensajeDiv.classList.add('hidden');
        }, duracion);
    }
}

// Variables globales para productos y filtros
let todosLosProductos = [];
let categoriaActiva = 'todos';
let pedidosRealizados = [];

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

// Para iniciar carrusel automático
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

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuario = usuarios.find(u => u.email === email && u.password === password);

    if (usuario) {
        localStorage.setItem('usuarioActual', JSON.stringify(usuario));
        alert(`Bienvenido, ${usuario.nombre}`);
        cerrarModalLogin();
        actualizarEstadoSesion();
        cargarPedidosDesdeStorage();
    } else {
        alert('Correo o contraseña incorrectos.');
    }
}

function actualizarEstadoSesion() {
    const cuentaTexto = cuentaBoton?.querySelector('span');
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));

    const seccionMisPedidos = document.getElementById('mis-pedidos');
    const linkMisPedidos = document.getElementById('link-mis-pedidos');

    if (usuarioActual && cuentaTexto) {
        cuentaTexto.textContent = 'Cerrar sesión';
        cuentaBoton.onclick = (e) => {
            e.preventDefault();
            if (confirm("¿Deseas cerrar sesión?")) {
                localStorage.removeItem('usuarioActual');
                cuentaTexto.textContent = 'Cuenta';
                cuentaBoton.onclick = (e) => {
                    e.preventDefault();
                    abrirModalLogin();
                };
                pedidosRealizados = [];

                // Ocultar secciones y enlaces al cerrar sesión
                seccionMisPedidos?.classList.add('hidden');
                document.getElementById('productos')?.classList.remove('hidden');
                linkMisPedidos?.classList.add('hidden');
            }
        };

        // Mostrar enlace y sección si hay sesión activa
        linkMisPedidos?.classList.remove('hidden');
    } else {
        seccionMisPedidos?.classList.add('hidden');
        linkMisPedidos?.classList.add('hidden');
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
        if (password !== confirmarPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        // Verificar si ya existe el usuario
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const usuarioExistente = usuarios.find(u => u.email === email);

        if (usuarioExistente) {
            alert('Ya existe una cuenta registrada con este correo.');
            return;
        }

        // Guardar nuevo usuario
        usuarios.push({ nombre, email, password });
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        alert(`¡Registro exitoso! Bienvenido ${nombre}`);
        cerrarModalLogin();
    } else {
        alert('Por favor, completa todos los campos');
    }
}

//función para crear el modal de confirmación de compra
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
                        <p class="text-lg font-bold text-red-600" id="total-confirmacion">USD 0.00</p>
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

    totalConfirmacion.textContent = `USD ${total}`;
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

function confirmarCompra() {
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    if (!usuarioActual) {
        alert("Debes iniciar sesión para realizar una compra.");
        return;
    }

    const nuevoPedido = {
        id: Date.now(),
        fecha: new Date().toLocaleDateString(),
        productos: [...carrito],
        total: parseFloat(calcularTotal())
    };

    const pedidosPorUsuario = JSON.parse(localStorage.getItem('pedidosPorUsuario')) || {};
    const email = usuarioActual.email;

    if (!pedidosPorUsuario[email]) {
        pedidosPorUsuario[email] = [];
    }

    pedidosPorUsuario[email].push(nuevoPedido);

    localStorage.setItem('pedidosPorUsuario', JSON.stringify(pedidosPorUsuario));
    pedidosRealizados = pedidosPorUsuario[email];

    carrito = [];
    guardarCarritoEnStorage();
    renderizarCarrito();
    cerrarModalConfirmacion();
    carritoPanel.classList.add('translate-x-full');
    alert('¡Gracias por tu compra! Tu pedido ha sido guardado.');
}

// Función para guardar pedidos en localStorage
function guardarPedidosEnStorage() {
    try {
        const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
        if (!usuarioActual) return;

        const pedidosPorUsuario = JSON.parse(localStorage.getItem('pedidosPorUsuario')) || {};
        pedidosPorUsuario[usuarioActual.email] = pedidosRealizados;

        localStorage.setItem('pedidosPorUsuario', JSON.stringify(pedidosPorUsuario));
    } catch (error) {
        console.error('Error al guardar pedidos:', error);
    }
}


function cargarPedidosDesdeStorage() {
    try {
        const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
        if (!usuarioActual) {
            pedidosRealizados = [];
            return;
        }

        const pedidosPorUsuario = JSON.parse(localStorage.getItem('pedidosPorUsuario')) || {};
        pedidosRealizados = pedidosPorUsuario[usuarioActual.email] || [];
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
        mostrarMensaje('Carrito guardado.', 'exito', 2000);
    } catch (error) {
        console.error('Error al guardar carrito:', error);
        mostrarMensaje('Error al guardar el carrito.', 'error');
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
        totalTexto.textContent = 'USD 0.00';
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
          <p class="text-xs text-gray-600">
            <button onclick="disminuirCantidad(${prod.id})" class="text-red-600 hover:text-red-800 font-bold px-2">-</button>
            ${prod.cantidad}
            <button onclick="aumentarCantidad(${prod.id})" class="text-green-600 hover:text-green-800 font-bold px-2">+</button>
            | 💲${(prod.price * prod.cantidad).toFixed(2)}
          </p>
        </div>
        <button class="text-red-600 hover:text-red-800 font-bold" onclick="eliminarDelCarrito(${prod.id})">×</button>
    `;

        contenedor.appendChild(div);
    });


    totalTexto.textContent = `USD ${calcularTotal()}`;
    actualizarContadorCarrito();
}

function aumentarCantidad(id) {
    const producto = carrito.find(p => p.id === id);
    if (producto) {
        producto.cantidad += 1;
        guardarCarritoEnStorage();
        renderizarCarrito();
    }
}

function disminuirCantidad(id) {
    const producto = carrito.find(p => p.id === id);
    if (producto) {
        producto.cantidad -= 1;
        if (producto.cantidad <= 0) {
            carrito = carrito.filter(p => p.id !== id);
        }
        guardarCarritoEnStorage();
        renderizarCarrito();
    }
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

    // Mostrar mensaje de carga
    mostrarMensaje('Cargando productos...', 'info', 1500);

    const titulo = document.getElementById('titulo-productos');
    const titulos = {
        'todos': 'Productos Destacados',
        'electronics': 'Productos de Electrónica',
        'jewelery': 'Productos de Joyería',
        "men's clothing": 'Ropa para Hombre',
        "women's clothing": 'Ropa para Mujer',
        'destacados': 'Productos Destacados (4+ Estrellas)'
    };

    if (document.getElementById('input-busqueda')) {
        document.getElementById('input-busqueda').value = '';
    }

    if (titulo) {
        titulo.textContent = titulos[categoria] || 'Productos Destacados';
    }

    // Simular un retardo de carga antes de mostrar
    setTimeout(() => {
        mostrarProductos(todosLosProductos, categoria);
    }, 500);
}


// Función para mostrar productos destacados
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
        // Filtrar productos con rating mayor o igual a 4
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
    const contenedor = document.getElementById('lista-productos');
    try {
        mostrarMensaje('Cargando productos...', 'info', 2000);
        const res = await fetch('https://fakestoreapi.com/products');
        if (!res.ok) throw new Error('Respuesta inválida del servidor');

        const productos = await res.json();
        todosLosProductos = productos;
        mostrarProductos(productos, categoriaActiva);
        mostrarMensaje('Productos cargados exitosamente.', 'exito', 3000);
    } catch (error) {
        console.error('Error al cargar productos:', error);
        if (contenedor) {
            contenedor.innerHTML = `<p class="text-red-500 col-span-full text-center">Error al cargar los productos. Por favor, recarga la página.</p>`;
        }
        mostrarMensaje('Error al cargar productos. Inténtalo más tarde.', 'error');
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

            nuevoBoton.textContent = '¡Agregado!';
            nuevoBoton.style.backgroundColor = '#10b981';
            setTimeout(() => {
                nuevoBoton.textContent = 'Agregar al carrito';
                nuevoBoton.style.backgroundColor = '';
            }, 1000);
        });
    });
}

// Función mejorada para mostrar mis pedidos con acordeón
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

    pedidosLista.innerHTML = '';

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

    // Agregar header con información general
    const headerDiv = document.createElement('div');
    headerDiv.className = 'bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-6 border border-blue-100';
    headerDiv.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <h3 class="text-lg font-semibold text-gray-800">Historial de Compras</h3>
                <p class="text-sm text-gray-600">Total de pedidos realizados: ${pedidosRealizados.length}</p>
            </div>
            <div class="text-right">
                <p class="text-sm text-gray-600">Total gastado:</p>
                <p class="text-xl font-bold text-green-600">
                    $${pedidosRealizados.reduce((sum, pedido) => sum + pedido.total, 0).toFixed(2)}
                </p>
            </div>
        </div>
        ${pedidosRealizados.length > 1 ? `
        <div class="mt-3 pt-3 border-t border-blue-200">
            <button onclick="confirmarLimpiarTodosPedidos()" 
                    class="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-2">
                <i class="ph ph-trash text-base"></i>
                Limpiar todo el historial
            </button>
        </div>
        ` : ''}
    `;
    pedidosLista.appendChild(headerDiv);

    // Mostrar pedidos realizados (ordenados por fecha más reciente) con acordeón
    pedidosRealizados.slice().reverse().forEach((pedido, index) => {
        const pedidoId = `pedido-${pedido.id}`;
        const pedidoDiv = document.createElement('div');
        pedidoDiv.className = 'bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden';

        const productosHTML = pedido.productos.map(prod => `
            <div class="flex items-center gap-3 py-3 px-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                <img src="${prod.image}" alt="${prod.title}" class="w-16 h-16 object-contain rounded border">
                <div class="flex-1 min-w-0">
                    <h4 class="font-medium text-sm text-gray-800 line-clamp-2 mb-1">${prod.title}</h4>
                    <div class="flex items-center gap-4 text-xs text-gray-600">
                        <span class="flex items-center gap-1">
                            <i class="ph ph-package text-sm"></i>
                            Cantidad: ${prod.cantidad}
                        </span>
                        <span class="flex items-center gap-1">
                            <i class="ph ph-currency-dollar text-sm"></i>
                            Precio: $${prod.price.toFixed(2)}
                        </span>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-semibold text-sm text-gray-800">$${(prod.price * prod.cantidad).toFixed(2)}</p>
                    <p class="text-xs text-gray-500">Subtotal</p>
                </div>
            </div>
        `).join('');

        pedidoDiv.innerHTML = `
            <!-- Header del acordeón -->
            <div class="cursor-pointer hover:bg-gray-50 transition-colors" onclick="toggleAcordeon('${pedidoId}')">
                <div class="flex items-center justify-between p-4">
                    <div class="flex items-center gap-4">
                        <div class="flex-shrink-0">
                            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <i class="ph ph-check-circle text-green-600 text-xl"></i>
                            </div>
                        </div>
                        <div>
                            <h3 class="font-bold text-lg text-gray-800">Pedido #${pedido.id}</h3>
                            <div class="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                <span class="flex items-center gap-1">
                                    <i class="ph ph-calendar text-sm"></i>
                                    ${pedido.fecha}
                                </span>
                                <span class="flex items-center gap-1">
                                    <i class="ph ph-package text-sm"></i>
                                    ${pedido.productos.length} producto${pedido.productos.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                            <span class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-2">
                                ✓ Completado
                            </span>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="text-right">
                            <p class="text-xl font-bold text-green-600">$${pedido.total.toFixed(2)}</p>
                            <p class="text-xs text-gray-500">Total</p>
                        </div>
                        <div class="flex flex-col gap-2">
                            <button onclick="event.stopPropagation(); confirmarEliminarPedido(${pedido.id})" 
                                    class="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-full transition-colors"
                                    title="Eliminar pedido">
                                <i class="ph ph-trash text-lg"></i>
                            </button>
                            <i id="icono-${pedidoId}" class="ph ph-caret-down text-gray-400 text-xl transition-transform duration-200"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Contenido del acordeón -->
            <div id="contenido-${pedidoId}" class="acordeon-contenido hidden">
                <div class="border-t border-gray-200">
                    <div class="p-4 bg-gray-50">
                        <h4 class="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <i class="ph ph-list text-lg"></i>
                            Productos del pedido
                        </h4>
                        <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            ${productosHTML}
                        </div>
                        <div class="mt-4 pt-4 border-t border-gray-300 bg-gray-100 rounded-lg p-3">
                            <div class="flex justify-between items-center">
                                <span class="font-semibold text-gray-700">Total del pedido:</span>
                                <span class="text-xl font-bold text-green-600">$${pedido.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        pedidosLista.appendChild(pedidoDiv);
    });
}

// Función para alternar el acordeón
function toggleAcordeon(pedidoId) {
    const contenido = document.getElementById(`contenido-${pedidoId}`);
    const icono = document.getElementById(`icono-${pedidoId}`);

    if (!contenido || !icono) return;

    const isHidden = contenido.classList.contains('hidden');

    // Cerrar todos los acordeones abiertos
    document.querySelectorAll('.acordeon-contenido').forEach(el => {
        el.classList.add('hidden');
    });
    document.querySelectorAll('[id^="icono-pedido-"]').forEach(el => {
        el.classList.remove('rotate-180');
    });

    if (isHidden) {
        // Abrir el acordeón seleccionado
        contenido.classList.remove('hidden');
        icono.classList.add('rotate-180');
    }
}

// Función para confirmar eliminación de un pedido
function confirmarEliminarPedido(pedidoId) {
    const pedido = pedidosRealizados.find(p => p.id === pedidoId);
    if (!pedido) {
        console.error('Pedido no encontrado:', pedidoId);
        return;
    }

    const confirmar = confirm(
        `¿Estás seguro de que deseas eliminar el pedido #${pedidoId}?\n\n` +
        `Fecha: ${pedido.fecha}\n` +
        `Total: $${pedido.total.toFixed(2)}\n` +
        `Productos: ${pedido.productos.length}\n\n` +
        `Esta acción no se puede deshacer.`
    );

    if (confirmar) {
        eliminarPedido(pedidoId);
    }
}

// Función para eliminar un pedido específico
function eliminarPedido(pedidoId) {
    const indice = pedidosRealizados.findIndex(p => p.id === pedidoId);

    if (indice === -1) {
        console.error('Pedido no encontrado para eliminar:', pedidoId);
        return;
    }

    // Eliminar el pedido del array
    pedidosRealizados.splice(indice, 1);

    // Guardar cambios en localStorage
    guardarPedidosEnStorage();

    // Actualizar la vista
    mostrarMisPedidos();

    // Mostrar mensaje de confirmación
    alert('El pedido ha sido eliminado exitosamente.');
}

// Función para confirmar limpieza de todos los pedidos
function confirmarLimpiarTodosPedidos() {
    const totalPedidos = pedidosRealizados.length;
    const totalGastado = pedidosRealizados.reduce((sum, pedido) => sum + pedido.total, 0);

    const confirmar = confirm(
        `¿Estás seguro de que deseas eliminar TODO el historial de pedidos?\n\n` +
        `Se eliminarán ${totalPedidos} pedidos\n` +
        `Total gastado: $${totalGastado.toFixed(2)}\n\n` +
        `Esta acción no se puede deshacer.`
    );

    if (confirmar) {
        limpiarTodosPedidos();
    }
}

// Función para limpiar todos los pedidos
function limpiarTodosPedidos() {
    pedidosRealizados = [];
    guardarPedidosEnStorage();
    mostrarMisPedidos();
    alert('Todo el historial de pedidos ha sido eliminado exitosamente.');
}

// Función para configurar el event listener del botón finalizar compra
function configurarBotonFinalizarCompra() {
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

    actualizarEstadoSesion();

    console.log('Inicialización completada');
    console.log('Pedidos realizados:', pedidosRealizados);
    const inputBusqueda = document.getElementById('input-busqueda');

    if (inputBusqueda) {
        inputBusqueda.addEventListener('input', () => {
            const texto = inputBusqueda.value.trim().toLowerCase();

            if (texto === '') {
                mostrarProductos(todosLosProductos, categoriaActiva);
                return;
            }

            const productosFiltrados = todosLosProductos.filter(producto =>
                producto.title.toLowerCase().includes(texto)
            );

            mostrarProductos(productosFiltrados, 'todos');
        });
    }

    const selectOrden = document.getElementById('ordenar-productos');

    if (selectOrden) {
        selectOrden.addEventListener('change', () => {
            aplicarOrdenamiento();
        });
    }

});

function aplicarOrdenamiento() {
    const selectOrden = document.getElementById('ordenar-productos');
    const valor = selectOrden.value;
    let productosOrdenados = [...todosLosProductos];

    if (valor === 'precio-asc') {
        productosOrdenados.sort((a, b) => a.price - b.price);
    } else if (valor === 'precio-desc') {
        productosOrdenados.sort((a, b) => b.price - a.price);
    } else if (valor === 'nombre-asc') {
        productosOrdenados.sort((a, b) => a.title.localeCompare(b.title));
    } else if (valor === 'nombre-desc') {
        productosOrdenados.sort((a, b) => b.title.localeCompare(a.title));
    }

    mostrarProductos(productosOrdenados, categoriaActiva);
}