/**
 * =============================================================
 * INICIALIZACIÓN GLOBAL
 * =============================================================
 */

// Selecciona todos los elementos del carrusel de imágenes.
const items = document.querySelectorAll('.carousel-item');
// Obtiene el botón para ir a la diapositiva anterior del carrusel.
const prev = document.getElementById('prevBtn');
// Obtiene el botón para ir a la siguiente diapositiva del carrusel.
const next = document.getElementById('nextBtn');
// Variable para rastrear el índice de la diapositiva actual en el carrusel.
let current = 0;
// Variable para almacenar el temporizador del carrusel automático.
let interval;

// Variables globales para la gestión de la tienda
let todosLosProductos = []; // Almacena todos los productos cargados desde la API.
let categoriaActiva = 'todos'; // Almacena la categoría de productos que se está mostrando actualmente.
let pedidosRealizados = []; // Almacena el historial de pedidos del usuario que ha iniciado sesión.


/**
 * =============================================================
 * SISTEMA DE NOTIFICACIONES
 * =============================================================
 */

/**
 * Muestra un mensaje temporal en la parte superior de la página.
 * @param {string} texto - El texto que se mostrará en el mensaje.
 * @param {string} [tipo='info'] - El tipo de mensaje ('info', 'exito', 'error') que determina el color.
 * @param {number} [duracion=2000] - La duración en milisegundos durante la cual el mensaje será visible. Si es 0, se mantiene visible.
 */
function mostrarMensaje(texto, tipo = 'info', duracion = 2000) {
    // Busca el contenedor del mensaje en el DOM.
    const mensajeDiv = document.getElementById('mensaje-error');
    // Si no se encuentra el contenedor, la función termina para evitar errores.
    if (!mensajeDiv) return;

    // Establece el texto del mensaje.
    mensajeDiv.textContent = texto;
    // Resetea las clases del contenedor a un estado base.
    mensajeDiv.className = 'text-center py-2 text-sm font-medium';

    // Aplica clases de estilo según el tipo de mensaje.
    if (tipo === 'error') {
        // Estilos para mensajes de error (fondo rojo).
        mensajeDiv.classList.add('bg-red-100', 'text-red-700', 'border', 'border-red-300');
    } else if (tipo === 'exito') {
        // Estilos para mensajes de éxito (fondo verde).
        mensajeDiv.classList.add('bg-green-100', 'text-green-700', 'border', 'border-green-300');
    } else {
        // Estilos por defecto para mensajes de información (fondo azul).
        mensajeDiv.classList.add('bg-blue-100', 'text-blue-700', 'border', 'border-blue-300');
    }

    // Hace visible el contenedor del mensaje eliminando la clase 'hidden'.
    mensajeDiv.classList.remove('hidden');

    // Si la duración es mayor que cero, oculta el mensaje después del tiempo especificado.
    if (duracion > 0) {
        setTimeout(() => {
            mensajeDiv.classList.add('hidden');
        }, duracion);
    }
}


/**
 * =============================================================
 * LÓGICA DEL CARRUSEL DE IMÁGENES
 * =============================================================
 */

/**
 * Muestra una diapositiva específica del carrusel y oculta las demás.
 * @param {number} index - El índice de la diapositiva que se debe mostrar.
 */
function showSlide(index) {
    // Itera sobre todos los elementos del carrusel.
    items.forEach((item, i) => {
        // Muestra el elemento si su índice coincide con el índice deseado.
        item.classList.toggle('opacity-100', i === index);
        // Oculta el elemento si su índice no coincide.
        item.classList.toggle('opacity-0', i !== index);
    });
}

/**
 * Avanza a la siguiente diapositiva del carrusel.
 */
function nextSlide() {
    // Calcula el índice de la siguiente diapositiva, volviendo al principio si llega al final.
    current = (current + 1) % items.length;
    // Muestra la nueva diapositiva.
    showSlide(current);
}

/**
 * Retrocede a la diapositiva anterior del carrusel.
 */
function prevSlide() {
    // Calcula el índice de la diapositiva anterior, yendo al final si está en el principio.
    current = (current - 1 + items.length) % items.length;
    // Muestra la nueva diapositiva.
    showSlide(current);
}

// Asigna el evento 'click' al botón "siguiente" si existe.
if (next) {
    next.addEventListener('click', () => {
        // Avanza a la siguiente diapositiva.
        nextSlide();
        // Reinicia el temporizador del carrusel automático.
        resetInterval();
    });
}

// Asigna el evento 'click' al botón "anterior" si existe.
if (prev) {
    prev.addEventListener('click', () => {
        // Retrocede a la diapositiva anterior.
        prevSlide();
        // Reinicia el temporizador del carrusel automático.
        resetInterval();
    });
}

/**
 * Reinicia el intervalo del carrusel automático para evitar cambios dobles.
 */
function resetInterval() {
    // Limpia el intervalo actual.
    clearInterval(interval);
    // Crea un nuevo intervalo para cambiar de diapositiva cada 5 segundos.
    interval = setInterval(nextSlide, 5000);
}

// Inicia el carrusel automático si hay elementos en él.
if (items.length > 0) {
    interval = setInterval(nextSlide, 5000);
}


/**
 * =============================================================
 * CONFIGURACIÓN DE PANELES Y MODALES (CARRITO Y LOGIN)
 * =============================================================
 */

// Configuración del panel lateral del carrito de compras.
const carritoPanel = document.getElementById('carrito');
const cerrarCarrito = document.getElementById('cerrarCarrito');
// Selecciona el botón del carrito (el ícono).
const carritoBoton = document.querySelector('a[href="#"] i.ph-shopping-cart')?.closest('a');

// Configuración del modal de inicio de sesión.
const cuentaBoton = document.querySelector('a[href="#"] i.ph-user-circle')?.closest('a');
const modalLogin = document.getElementById('modal-login');
const cerrarModal = document.getElementById('cerrar-modal');
const overlay = document.getElementById('overlay-modal'); // Fondo oscuro del modal.

// Asigna el evento para cerrar el panel del carrito.
if (cerrarCarrito) {
    cerrarCarrito.addEventListener('click', () => {
        // Oculta el panel deslizándolo hacia la derecha.
        carritoPanel.classList.add('translate-x-full');
    });
}

// Asigna el evento para abrir el panel del carrito.
carritoBoton?.addEventListener('click', (e) => {
    e.preventDefault(); // Evita el comportamiento por defecto del enlace.
    // Muestra el panel deslizándolo a su posición original.
    carritoPanel.classList.remove('translate-x-full');
});

// Event listeners para abrir y cerrar el modal de login.
cuentaBoton?.addEventListener('click', (e) => {
    e.preventDefault(); // Evita que la página se desplace.
    abrirModalLogin(); // Llama a la función que abre el modal.
});

// Asigna los eventos para cerrar el modal de login.
cerrarModal?.addEventListener('click', cerrarModalLogin); // Clic en el botón de cerrar (X).
overlay?.addEventListener('click', cerrarModalLogin); // Clic en el fondo oscuro.

// Variable para almacenar los productos en el carrito.
let carrito = [];


/**
 * =============================================================
 * LÓGICA DEL MODAL DE LOGIN Y REGISTRO
 * =============================================================
 */

/**
 * Abre el modal de inicio de sesión y registro.
 */
function abrirModalLogin() {
    // Muestra el modal.
    modalLogin?.classList.remove('hidden');
    modalLogin?.classList.add('flex');
    // Evita que se pueda hacer scroll en el fondo de la página.
    document.body.style.overflow = 'hidden';
}

/**
 * Cierra el modal de inicio de sesión y registro.
 */
function cerrarModalLogin() {
    // Oculta el modal.
    modalLogin?.classList.add('hidden');
    modalLogin?.classList.remove('flex');
    // Restaura el scroll del cuerpo de la página.
    document.body.style.overflow = 'auto';
}

/**
 * Gestiona el proceso de inicio de sesión de un usuario.
 * @param {Event} event - El objeto del evento submit del formulario.
 */
function manejarLogin(event) {
    event.preventDefault(); // Evita que el formulario se envíe y recargue la página.
    // Obtiene los valores de los campos de email y contraseña.
    const email = document.getElementById('email-login').value;
    const password = document.getElementById('password-login').value;

    // Carga la lista de usuarios desde localStorage (o un array vacío si no existe).
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    // Busca un usuario que coincida con el email y la contraseña ingresados.
    const usuario = usuarios.find(u => u.email === email && u.password === password);

    // Si se encuentra un usuario.
    if (usuario) {
        // Guarda los datos del usuario actual en localStorage.
        localStorage.setItem('usuarioActual', JSON.stringify(usuario));
        // Muestra una alerta de bienvenida.
        alert(`Bienvenido, ${usuario.nombre}`);
        // Cierra el modal de login.
        cerrarModalLogin();
        // Actualiza la interfaz para reflejar que el usuario ha iniciado sesión.
        actualizarEstadoSesion();
        // Carga los pedidos asociados a este usuario.
        cargarPedidosDesdeStorage();
    } else {
        // Si no se encuentra, muestra un mensaje de error.
        alert('Correo o contraseña incorrectos.');
    }
}

/**
 * Actualiza la interfaz de usuario (UI) para reflejar el estado de la sesión (iniciada o cerrada).
 */
function actualizarEstadoSesion() {
    // Obtiene el elemento de texto del botón "Cuenta".
    const cuentaTexto = cuentaBoton?.querySelector('span');
    // Obtiene el usuario actual desde localStorage.
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));

    // Obtiene la sección y el enlace de "Mis Pedidos".
    const seccionMisPedidos = document.getElementById('mis-pedidos');
    const linkMisPedidos = document.getElementById('link-mis-pedidos');

    // Si hay un usuario con sesión activa y el elemento de texto existe.
    if (usuarioActual && cuentaTexto) {
        // Cambia el texto del botón a "Cerrar sesión".
        cuentaTexto.textContent = 'Cerrar sesión';
        // Cambia la funcionalidad del botón para que ahora cierre la sesión.
        cuentaBoton.onclick = (e) => {
            e.preventDefault();
            // Pide confirmación al usuario antes de cerrar sesión.
            if (confirm("¿Deseas cerrar sesión?")) {
                // Elimina los datos del usuario del localStorage.
                localStorage.removeItem('usuarioActual');
                // Restaura el texto original del botón.
                cuentaTexto.textContent = 'Cuenta';
                // Restaura la funcionalidad original del botón para abrir el modal de login.
                cuentaBoton.onclick = (e) => {
                    e.preventDefault();
                    abrirModalLogin();
                };
                // Limpia el array de pedidos realizados.
                pedidosRealizados = [];

                // Oculta la sección y el enlace de "Mis Pedidos".
                seccionMisPedidos?.classList.add('hidden');
                // Muestra la sección de productos.
                document.getElementById('productos')?.classList.remove('hidden');
                // Oculta el enlace "Mis Pedidos".
                linkMisPedidos?.classList.add('hidden');
            }
        };

        // Muestra el enlace y la sección de "Mis Pedidos".
        linkMisPedidos?.classList.remove('hidden');
    } else {
        // Si no hay sesión activa, oculta la sección y el enlace de "Mis Pedidos".
        seccionMisPedidos?.classList.add('hidden');
        linkMisPedidos?.classList.add('hidden');
    }
}


/**
 * Alterna la visibilidad entre el formulario de login y el de registro.
 * @param {string} tipo - 'login' o 'register' para indicar qué formulario mostrar.
 */
function alternarFormulario(tipo) {
    // Obtiene los elementos de los formularios y las pestañas.
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');

    if (tipo === 'login') {
        // Muestra el formulario de login y oculta el de registro.
        loginForm?.classList.remove('hidden');
        registerForm?.classList.add('hidden');
        // Resalta la pestaña de login y quita el resaltado de la de registro.
        loginTab?.classList.add('border-b-2', 'border-red-600', 'text-red-600');
        loginTab?.classList.remove('text-gray-600');
        registerTab?.classList.remove('border-b-2', 'border-red-600', 'text-red-600');
        registerTab?.classList.add('text-gray-600');
    } else {
        // Muestra el formulario de registro y oculta el de login.
        registerForm?.classList.remove('hidden');
        loginForm?.classList.add('hidden');
        // Resalta la pestaña de registro y quita el resaltado de la de login.
        registerTab?.classList.add('border-b-2', 'border-red-600', 'text-red-600');
        registerTab?.classList.remove('text-gray-600');
        loginTab?.classList.remove('border-b-2', 'border-red-600', 'text-red-600');
        loginTab?.classList.add('text-gray-600');
    }
}

/**
 * Gestiona el proceso de registro de un nuevo usuario.
 * @param {Event} event - El objeto del evento submit del formulario.
 */
function manejarRegistro(event) {
    event.preventDefault(); // Evita que el formulario se envíe.
    // Obtiene los valores de los campos del formulario de registro.
    const nombre = document.getElementById('nombre-registro').value;
    const email = document.getElementById('email-registro').value;
    const password = document.getElementById('password-registro').value;
    const confirmarPassword = document.getElementById('confirmar-password').value;

    // Verifica que todos los campos estén completos.
    if (nombre && email && password && confirmarPassword) {
        // Verifica que las contraseñas coincidan.
        if (password !== confirmarPassword) {
            alert('Las contraseñas no coinciden');
            return; // Termina la función si no coinciden.
        }

        // Carga la lista de usuarios desde localStorage.
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        // Verifica si ya existe un usuario con el mismo email.
        const usuarioExistente = usuarios.find(u => u.email === email);

        // Si el usuario ya existe, muestra un error.
        if (usuarioExistente) {
            alert('Ya existe una cuenta registrada con este correo.');
            return;
        }

        // Agrega el nuevo usuario al array de usuarios.
        usuarios.push({ nombre, email, password });
        // Guarda el array actualizado en localStorage.
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        // Muestra un mensaje de éxito.
        alert(`¡Registro exitoso! Bienvenido ${nombre}`);
        // Cierra el modal.
        cerrarModalLogin();
    } else {
        // Si faltan campos, pide al usuario que los complete.
        alert('Por favor, completa todos los campos');
    }
}


/**
 * =============================================================
 * LÓGICA DEL MODAL DE CONFIRMACIÓN DE COMPRA
 * =============================================================
 */

/**
 * Crea y añade el HTML del modal de confirmación de compra al DOM si no existe.
 */
function crearModalConfirmacion() {
    // Verifica si el modal ya ha sido creado para no duplicarlo.
    if (document.getElementById('modal-confirmacion')) {
        return;
    }

    // Define la estructura HTML del modal.
    const modalHTML = `
    <div id="modal-confirmacion" class="fixed inset-0 z-50 hidden items-center justify-center">
        <div class="absolute inset-0 bg-black bg-opacity-50"></div>
        
        <div class="relative bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div class="flex items-center justify-center p-6 border-b bg-red-600 text-white">
                <div class="text-center">
                    <i class="ph ph-shopping-cart text-3xl mb-2"></i>
                    <h2 class="text-xl font-semibold">Confirmar Compra</h2>
                </div>
            </div>

            <div class="p-6">
                <div class="text-center mb-6">
                    <p class="text-gray-700 mb-4">¿Estás seguro de que deseas finalizar tu compra?</p>
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <p class="text-sm text-gray-600 mb-2">Resumen de tu pedido:</p>
                        <p class="text-lg font-bold text-red-600" id="total-confirmacion">USD 0.00</p>
                        <p class="text-sm text-gray-500" id="items-confirmacion">0 productos</p>
                    </div>
                </div>

                <div class="flex flex-col gap-3">
                    <button id="confirmar-compra" class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition duration-200 flex items-center justify-center gap-2">
                        <i class="ph ph-check-circle text-lg"></i>
                        Confirmar Compra
                    </button>
                    <button id="cancelar-compra" class="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center gap-2">
                        <i class="ph ph-x-circle text-lg"></i>
                        Seguir Comprando
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;

    // Inserta el HTML del modal al final del body.
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Obtiene los elementos del modal recién creado.
    const modalConfirmacion = document.getElementById('modal-confirmacion');
    const btnConfirmar = document.getElementById('confirmar-compra');
    const btnCancelar = document.getElementById('cancelar-compra');

    // Asigna los eventos a los botones.
    btnConfirmar.addEventListener('click', confirmarCompra);
    btnCancelar.addEventListener('click', cerrarModalConfirmacion);

    // Cierra el modal si se hace clic en el overlay (fondo oscuro).
    modalConfirmacion.addEventListener('click', (e) => {
        if (e.target === modalConfirmacion) {
            cerrarModalConfirmacion();
        }
    });
}

/**
 * Abre el modal de confirmación de compra y actualiza su contenido.
 */
function abrirModalConfirmacion() {
    // Verifica si el carrito está vacío.
    if (carrito.length === 0) {
        alert('Tu carrito está vacío');
        return; // No abre el modal si no hay productos.
    }

    // Crea el modal si no existe.
    crearModalConfirmacion();

    // Obtiene los elementos del modal para actualizar la información.
    const modal = document.getElementById('modal-confirmacion');
    const totalConfirmacion = document.getElementById('total-confirmacion');
    const itemsConfirmacion = document.getElementById('items-confirmacion');

    // Calcula el total del carrito y la cantidad de items.
    const total = calcularTotal();
    const totalItems = carrito.reduce((sum, prod) => sum + prod.cantidad, 0);

    // Actualiza el texto en el modal con los datos del pedido.
    totalConfirmacion.textContent = `USD ${total}`;
    itemsConfirmacion.textContent = `${totalItems} producto${totalItems !== 1 ? 's' : ''}`;

    // Muestra el modal.
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    // Bloquea el scroll del fondo.
    document.body.style.overflow = 'hidden';
}

/**
 * Cierra el modal de confirmación de compra.
 */
function cerrarModalConfirmacion() {
    const modal = document.getElementById('modal-confirmacion');
    // Oculta el modal.
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    // Restaura el scroll del fondo.
    document.body.style.overflow = 'auto';
}

/**
 * Procesa y finaliza la compra.
 */
function confirmarCompra() {
    // Verifica si hay un usuario con sesión iniciada.
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    if (!usuarioActual) {
        alert("Debes iniciar sesión para realizar una compra.");
        return;
    }

    // Crea un nuevo objeto de pedido con un ID único (basado en la fecha), la fecha actual, los productos y el total.
    const nuevoPedido = {
        id: Date.now(),
        fecha: new Date().toLocaleDateString(),
        productos: [...carrito], // Crea una copia del carrito.
        total: parseFloat(calcularTotal())
    };

    // Carga la base de datos de pedidos desde localStorage.
    const pedidosPorUsuario = JSON.parse(localStorage.getItem('pedidosPorUsuario')) || {};
    const email = usuarioActual.email; // Usa el email como clave para los pedidos del usuario.

    // Si es el primer pedido del usuario, inicializa su array de pedidos.
    if (!pedidosPorUsuario[email]) {
        pedidosPorUsuario[email] = [];
    }

    // Añade el nuevo pedido al historial del usuario.
    pedidosPorUsuario[email].push(nuevoPedido);

    // Guarda la base de datos de pedidos actualizada en localStorage.
    localStorage.setItem('pedidosPorUsuario', JSON.stringify(pedidosPorUsuario));
    // Actualiza la variable local de pedidos realizados.
    pedidosRealizados = pedidosPorUsuario[email];

    // Vacía el carrito.
    carrito = [];
    // Guarda el carrito vacío en localStorage.
    guardarCarritoEnStorage();
    // Actualiza la vista del carrito (que ahora estará vacío).
    renderizarCarrito();
    // Cierra el modal de confirmación.
    cerrarModalConfirmacion();
    // Oculta el panel del carrito.
    carritoPanel.classList.add('translate-x-full');
    // Notifica al usuario que la compra fue exitosa.
    alert('¡Gracias por tu compra! Tu pedido ha sido guardado.');
}


/**
 * =============================================================
 * GESTIÓN DE PEDIDOS
 * =============================================================
 */

/**
 * Guarda el array `pedidosRealizados` en localStorage, asociado al usuario actual.
 */
function guardarPedidosEnStorage() {
    try {
        // Obtiene el usuario actual.
        const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
        // Si no hay sesión, no hace nada.
        if (!usuarioActual) return;

        // Carga la base de datos de pedidos.
        const pedidosPorUsuario = JSON.parse(localStorage.getItem('pedidosPorUsuario')) || {};
        // Asigna el array de pedidos actual al email del usuario.
        pedidosPorUsuario[usuarioActual.email] = pedidosRealizados;

        // Guarda el objeto actualizado en localStorage.
        localStorage.setItem('pedidosPorUsuario', JSON.stringify(pedidosPorUsuario));
    } catch (error) {
        // Muestra un error en consola si falla el guardado.
        console.error('Error al guardar pedidos:', error);
    }
}


/**
 * Carga los pedidos del usuario actual desde localStorage al array `pedidosRealizados`.
 */
function cargarPedidosDesdeStorage() {
    try {
        // Obtiene el usuario actual.
        const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
        // Si no hay sesión, el array de pedidos se vacía.
        if (!usuarioActual) {
            pedidosRealizados = [];
            return;
        }

        // Carga la base de datos de pedidos.
        const pedidosPorUsuario = JSON.parse(localStorage.getItem('pedidosPorUsuario')) || {};
        // Asigna los pedidos del usuario actual a la variable global, o un array vacío si no tiene pedidos.
        pedidosRealizados = pedidosPorUsuario[usuarioActual.email] || [];
    } catch (error) {
        // En caso de error, muestra un mensaje en consola y resetea los pedidos.
        console.error('Error al cargar pedidos:', error);
        pedidosRealizados = [];
    }
}

/**
 * =============================================================
 * LÓGICA DEL CARRITO DE COMPRAS
 * =============================================================
 */

/**
 * Carga el contenido del carrito desde localStorage al iniciar la página.
 */
function cargarCarritoDesdeStorage() {
    try {
        // Obtiene los datos del carrito de localStorage.
        const data = localStorage.getItem('carrito');
        // Si existen datos, los convierte de JSON a un objeto y actualiza la vista.
        if (data) {
            carrito = JSON.parse(data);
            renderizarCarrito();
        } else {
            // Si no hay datos, solo actualiza el contador (a 0).
            actualizarContadorCarrito();
        }
    } catch (error) {
        // Si hay un error (ej. JSON mal formado), lo reporta y resetea el carrito.
        console.error('Error al cargar carrito:', error);
        carrito = [];
        actualizarContadorCarrito();
    }
}

/**
 * Guarda el estado actual del carrito en localStorage.
 */
function guardarCarritoEnStorage() {
    try {
        // Convierte el array del carrito a una cadena JSON y lo guarda.
        localStorage.setItem('carrito', JSON.stringify(carrito));
        // Muestra un mensaje de éxito temporal.
        mostrarMensaje('Carrito guardado.', 'exito', 2000);
    } catch (error) {
        // Si falla, lo reporta y muestra un mensaje de error.
        console.error('Error al guardar carrito:', error);
        mostrarMensaje('Error al guardar el carrito.', 'error');
    }
}

/**
 * Calcula el precio total de todos los productos en el carrito.
 * @returns {string} El total formateado con dos decimales.
 */
function calcularTotal() {
    // Usa reduce para sumar el resultado de (precio * cantidad) de cada producto.
    return carrito.reduce((total, prod) => total + prod.price * prod.cantidad, 0).toFixed(2);
}

/**
 * Actualiza el número que aparece sobre el ícono del carrito.
 */
function actualizarContadorCarrito() {
    // Selecciona el elemento del contador.
    const contador = document.querySelector('.absolute.-top-1.-right-2');
    // Suma las cantidades de todos los productos en el carrito.
    const totalItems = carrito.reduce((total, prod) => total + prod.cantidad, 0);

    // Si el contador existe, actualiza su contenido.
    if (contador) {
        contador.textContent = totalItems;
    }
}

/**
 * Dibuja o actualiza la lista de productos en el panel del carrito.
 */
function renderizarCarrito() {
    // Obtiene el contenedor de los items y el elemento del total.
    const contenedor = document.getElementById('items-carrito');
    const totalTexto = document.getElementById('total-carrito');

    // Si alguno no existe, termina la función.
    if (!contenedor || !totalTexto) return;

    // Limpia el contenido actual del carrito.
    contenedor.innerHTML = '';

    // Si el carrito está vacío, muestra un mensaje y pone el total a cero.
    if (carrito.length === 0) {
        contenedor.innerHTML = '<p class="text-gray-500">Tu carrito está vacío.</p>';
        totalTexto.textContent = 'USD 0.00';
        actualizarContadorCarrito(); // Actualiza el contador del ícono.
        return;
    }

    // Itera sobre cada producto en el carrito.
    carrito.forEach(prod => {
        // Crea un nuevo div para el producto.
        const div = document.createElement('div');
        div.className = 'flex items-center gap-4';

        // Define el HTML interno del elemento del producto.
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

        // Añade el elemento al contenedor.
        contenedor.appendChild(div);
    });


    // Actualiza el texto del total.
    totalTexto.textContent = `USD ${calcularTotal()}`;
    // Actualiza el contador del ícono del carrito.
    actualizarContadorCarrito();
}

/**
 * Aumenta en 1 la cantidad de un producto en el carrito.
 * @param {number} id - El ID del producto a aumentar.
 */
function aumentarCantidad(id) {
    // Busca el producto en el carrito por su ID.
    const producto = carrito.find(p => p.id === id);
    if (producto) {
        // Incrementa la cantidad.
        producto.cantidad += 1;
        // Guarda y actualiza la vista.
        guardarCarritoEnStorage();
        renderizarCarrito();
    }
}

/**
 * Disminuye en 1 la cantidad de un producto en el carrito. Si llega a 0, lo elimina.
 * @param {number} id - El ID del producto a disminuir.
 */
function disminuirCantidad(id) {
    // Busca el producto en el carrito.
    const producto = carrito.find(p => p.id === id);
    if (producto) {
        // Decrementa la cantidad.
        producto.cantidad -= 1;
        // Si la cantidad es 0 o menos, elimina el producto del carrito.
        if (producto.cantidad <= 0) {
            carrito = carrito.filter(p => p.id !== id);
        }
        // Guarda y actualiza la vista.
        guardarCarritoEnStorage();
        renderizarCarrito();
    }
}


/**
 * Elimina un producto completamente del carrito, sin importar su cantidad.
 * @param {number} id - El ID del producto a eliminar.
 */
function eliminarDelCarrito(id) {
    // Filtra el carrito para mantener todos los productos excepto el que coincide con el ID.
    carrito = carrito.filter(prod => prod.id !== id);
    // Guarda y actualiza la vista.
    guardarCarritoEnStorage();
    renderizarCarrito();
}


/**
 * =============================================================
 * LÓGICA DE VISUALIZACIÓN Y FILTRADO DE PRODUCTOS
 * =============================================================
 */

/**
 * Filtra y muestra los productos según una categoría seleccionada.
 * @param {string} categoria - La categoría por la cual filtrar ('todos', 'electronics', etc.).
 */
function filtrarPorCategoria(categoria) {
    // Actualiza la variable global de categoría activa.
    categoriaActiva = categoria;

    // Oculta la sección "Mis Pedidos" y muestra la de "Productos".
    document.getElementById('mis-pedidos')?.classList.add('hidden');
    document.getElementById('productos')?.classList.remove('hidden');

    // Muestra un mensaje de "cargando".
    mostrarMensaje('Cargando productos...', 'info', 1500);

    // Selecciona el elemento del título de la sección.
    const titulo = document.getElementById('titulo-productos');
    // Define los textos de los títulos para cada categoría.
    const titulos = {
        'todos': 'Productos Destacados',
        'electronics': 'Productos de Electrónica',
        'jewelery': 'Productos de Joyería',
        "men's clothing": 'Ropa para Hombre',
        "women's clothing": 'Ropa para Mujer',
        'destacados': 'Productos Destacados (4+ Estrellas)'
    };

    // Limpia el campo de búsqueda si existe.
    if (document.getElementById('input-busqueda')) {
        document.getElementById('input-busqueda').value = '';
    }

    // Actualiza el título de la sección.
    if (titulo) {
        titulo.textContent = titulos[categoria] || 'Productos Destacados';
    }

    // Simula un pequeño retardo para mejorar la experiencia de usuario.
    setTimeout(() => {
        // Llama a la función que renderiza los productos filtrados.
        mostrarProductos(todosLosProductos, categoria);
    }, 500);
}


/**
 * Función de conveniencia para mostrar los productos destacados.
 */
function mostrarProductosDestacados() {
    // Establece la categoría activa a 'destacados'.
    categoriaActiva = 'destacados';
    // Llama a la función de filtrado principal.
    filtrarPorCategoria('destacados');
}

/**
 * Renderiza la lista de productos en el DOM.
 * @param {Array<Object>} productos - El array de productos a mostrar.
 * @param {string} [categoria='todos'] - La categoría actual para filtrar los productos.
 */
function mostrarProductos(productos, categoria = 'todos') {
    // Obtiene el contenedor de la lista de productos.
    const contenedor = document.getElementById('lista-productos');
    if (!contenedor) return; // Si no existe, termina.

    // Limpia el contenedor.
    contenedor.innerHTML = '';

    // Filtra los productos según la categoría seleccionada.
    let productosFiltrados;

    if (categoria === 'todos') {
        // Si la categoría es 'todos', usa todos los productos.
        productosFiltrados = productos;
    } else if (categoria === 'destacados') {
        // Filtra productos con una calificación (rating) de 4.0 o superior.
        productosFiltrados = productos.filter(producto => producto.rating.rate >= 4.0);
    } else {
        // Filtra por la categoría específica.
        productosFiltrados = productos.filter(producto => producto.category === categoria);
    }

    // Si no se encuentran productos después de filtrar, muestra un mensaje.
    if (productosFiltrados.length === 0) {
        const mensaje = categoria === 'destacados'
            ? 'No se encontraron productos destacados (4+ estrellas).'
            : 'No se encontraron productos en esta categoría.';
        contenedor.innerHTML = `<p class="text-gray-500 col-span-full text-center">${mensaje}</p>`;
        return;
    }

    // Si la categoría es 'destacados', ordena los productos por rating de mayor a menor.
    if (categoria === 'destacados') {
        productosFiltrados.sort((a, b) => b.rating.rate - a.rating.rate);
    }

    // Itera sobre los productos filtrados para crear sus tarjetas.
    productosFiltrados.forEach(producto => {
        // Crea el elemento div para la tarjeta.
        const tarjeta = document.createElement('div');
        tarjeta.className = 'bg-white rounded-lg shadow-md p-4 flex flex-col hover:shadow-lg transition';

        // Agrega una insignia "DESTACADO" si corresponde.
        const badgeDestacado = categoria === 'destacados'
            ? '<div class="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">⭐ DESTACADO</div>'
            : '';

        // Define el HTML interno de la tarjeta del producto.
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

        // Añade la tarjeta al contenedor.
        contenedor.appendChild(tarjeta);
    });

    // Vuelve a asignar los eventos a los botones "Agregar al carrito".
    activarBotonesCarrito(productos);

    // Si la categoría es 'destacados', muestra un banner informativo en la parte superior.
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
        // Inserta el banner al principio del contenedor.
        contenedor.insertBefore(infoDiv, contenedor.firstChild);
    }
}

/**
 * Carga la lista de productos desde la API "Fake Store API".
 */
async function cargarProductos() {
    const contenedor = document.getElementById('lista-productos');
    try {
        // Muestra un mensaje de "cargando".
        mostrarMensaje('Cargando productos...', 'info', 2000);
        // Realiza la petición a la API.
        const res = await fetch('https://fakestoreapi.com/products');
        // Si la respuesta no es exitosa, lanza un error.
        if (!res.ok) throw new Error('Respuesta inválida del servidor');

        // Convierte la respuesta a JSON.
        const productos = await res.json();
        // Almacena los productos en la variable global.
        todosLosProductos = productos;
        // Muestra los productos en la vista inicial.
        mostrarProductos(productos, categoriaActiva);
        // Muestra un mensaje de éxito.
        mostrarMensaje('Productos cargados exitosamente.', 'exito', 3000);
    } catch (error) {
        // Si ocurre un error, lo reporta en la consola.
        console.error('Error al cargar productos:', error);
        // Muestra un mensaje de error en la interfaz.
        if (contenedor) {
            contenedor.innerHTML = `<p class="text-red-500 col-span-full text-center">Error al cargar los productos. Por favor, recarga la página.</p>`;
        }
        // Muestra una notificación de error.
        mostrarMensaje('Error al cargar productos. Inténtalo más tarde.', 'error');
    }
}

/**
 * Asigna los eventos 'click' a todos los botones "Agregar al carrito".
 * @param {Array<Object>} productos - La lista completa de productos para poder encontrar el producto por ID.
 */
function activarBotonesCarrito(productos) {
    // Selecciona todos los botones con la clase 'btn-carrito'.
    const botones = document.querySelectorAll('.btn-carrito');
    botones.forEach(boton => {
        // Clona el botón para remover event listeners previos y evitar duplicados.
        const nuevoBoton = boton.cloneNode(true);
        boton.parentNode.replaceChild(nuevoBoton, boton);

        // Agrega el evento 'click' al nuevo botón.
        nuevoBoton.addEventListener('click', () => {
            // Obtiene el ID del producto desde el atributo 'data-id'.
            const id = parseInt(nuevoBoton.getAttribute('data-id'));
            // Busca el producto correspondiente en el array de productos.
            const producto = productos.find(p => p.id === id);

            // Si no se encuentra el producto, muestra un error en consola.
            if (!producto) {
                console.error('Producto no encontrado:', id);
                return;
            }

            // Busca si el producto ya existe en el carrito.
            const existente = carrito.find(p => p.id === id);

            if (existente) {
                // Si ya existe, simplemente incrementa su cantidad.
                existente.cantidad += 1;
            } else {
                // Si no existe, lo agrega al carrito con cantidad 1.
                carrito.push({
                    id: producto.id,
                    title: producto.title,
                    price: producto.price,
                    image: producto.image,
                    cantidad: 1
                });
            }

            // Guarda el carrito y actualiza la vista.
            guardarCarritoEnStorage();
            renderizarCarrito();

            // Cambia temporalmente el texto y color del botón para dar feedback al usuario.
            nuevoBoton.textContent = '¡Agregado!';
            nuevoBoton.style.backgroundColor = '#10b981'; // Color verde
            setTimeout(() => {
                // Después de 1 segundo, restaura el texto y color originales.
                nuevoBoton.textContent = 'Agregar al carrito';
                nuevoBoton.style.backgroundColor = '';
            }, 1000);
        });
    });
}

function misFavoritos() {
    const favoritosSection = document.getElementById('mis-favoritos');
    const productosSection = document.getElementById('productos');

    if (!favoritosSection || !productosSection) {
        console.error('No se encontraron los elementos necesarios para mostrar favoritos');
        return;
    }

    favoritosSection.classList.remove('hidden');
    productosSection.classList.add('hidden');       

    const favoritosLista = document.getElementById('lista-favoritos');
    if (!favoritosLista) {
        console.error('No se encontró el elemento de la lista de favoritos');
        return;
    }
    favoritosLista.innerHTML = '';

    if (favoritos.length === 0) {   
        favoritosLista.innerHTML = `
            <div class="text-center py-8">
                <i class="ph ph-heart text-6xl text-gray-300 mb-4"></i>
                <p class="text-gray-500 text-lg">No tienes productos favoritos.</p>
                <p class="text-gray-400 text-sm mt-2">Agrega productos a tus favoritos para verlos aquí.</p>
            </div>
        `;
        return;
    }

    favoritos.forEach((producto) => {
        const productoDiv = document.createElement('div');
        productoDiv.className = 'bg-white rounded-lg shadow-md p-4 mb-4 flex items-center gap-4';

        productoDiv.innerHTML = `
            <img src="${producto.image}" alt="${producto.title}" class="w-16 h-16 object-contain rounded border">
            <div class="flex-1 min-w-0">
                <h4 class="font-medium text-sm text-gray-800 line-clamp-2 mb-1">${producto.title}</h4>
                <p class="text-lg font-bold text-gray-800">💲${producto.price.toFixed(2)}</p>
            </div>
            <button class="text-red-600 hover:text-red-800 font-bold" onclick="eliminarDelFavoritos(${producto.id})">×</button>
        `;  
        favoritosLista.appendChild(productoDiv);
    });



}

/**
 * =============================================================
 * VISTA "MIS PEDIDOS"
 * =============================================================
 */

/**
 * Muestra la sección "Mis Pedidos" con el historial de compras del usuario.
 */
function mostrarMisPedidos() {
    // Obtiene los elementos necesarios del DOM.
    const pedidosSection = document.getElementById('mis-pedidos');
    const productosSection = document.getElementById('productos');
    const pedidosLista = document.getElementById('lista-pedidos');

    // Si algún elemento no se encuentra, muestra un error en consola.
    if (!pedidosSection || !productosSection || !pedidosLista) {
        console.error('No se encontraron los elementos necesarios para mostrar pedidos');
        return;
    }

    // Muestra la sección de pedidos y oculta la de productos.
    pedidosSection.classList.remove('hidden');
    productosSection.classList.add('hidden');

    // Limpia el contenido anterior de la lista de pedidos.
    pedidosLista.innerHTML = '';

    // Si no hay pedidos, muestra un mensaje indicándolo.
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

    // Crea y añade una cabecera con un resumen del historial de compras.
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
            <button onclick="confirmarLimpiarTodosPedidos()" class="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-2">
                <i class="ph ph-trash text-base"></i>
                Limpiar todo el historial
            </button>
        </div>
        ` : ''}
    `;
    pedidosLista.appendChild(headerDiv);

    // Muestra cada pedido en un formato de acordeón, del más reciente al más antiguo.
    pedidosRealizados.slice().reverse().forEach((pedido, index) => {
        const pedidoId = `pedido-${pedido.id}`;
        const pedidoDiv = document.createElement('div');
        pedidoDiv.className = 'bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden';

        // Genera el HTML para la lista de productos dentro de cada pedido.
        const productosHTML = pedido.productos.map(prod => `
            <div class="flex items-center gap-3 py-3 px-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                <img src="${prod.image}" alt="${prod.title}" class="w-16 h-16 object-contain rounded border">
                <div class="flex-1 min-w-0">
                    <h4 class="font-medium text-sm text-gray-800 line-clamp-2 mb-1">${prod.title}</h4>
                    <div class="flex items-center gap-4 text-xs text-gray-600">
                        <span class="flex items-center gap-1"><i class="ph ph-package text-sm"></i> Cantidad: ${prod.cantidad}</span>
                        <span class="flex items-center gap-1"><i class="ph ph-currency-dollar text-sm"></i> Precio: $${prod.price.toFixed(2)}</span>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-semibold text-sm text-gray-800">$${(prod.price * prod.cantidad).toFixed(2)}</p>
                    <p class="text-xs text-gray-500">Subtotal</p>
                </div>
            </div>
        `).join('');

        // Define la estructura HTML del acordeón para el pedido.
        pedidoDiv.innerHTML = `
            <div class="cursor-pointer hover:bg-gray-50 transition-colors" onclick="toggleAcordeon('${pedidoId}')">
                <div class="flex items-center justify-between p-4">
                    <div class="flex items-center gap-4">
                        <div class="flex-shrink-0"><div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"><i class="ph ph-check-circle text-green-600 text-xl"></i></div></div>
                        <div>
                            <h3 class="font-bold text-lg text-gray-800">Pedido #${pedido.id}</h3>
                            <div class="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                <span class="flex items-center gap-1"><i class="ph ph-calendar text-sm"></i> ${pedido.fecha}</span>
                                <span class="flex items-center gap-1"><i class="ph ph-package text-sm"></i> ${pedido.productos.length} producto${pedido.productos.length !== 1 ? 's' : ''}</span>
                            </div>
                            <span class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-2">✓ Completado</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="text-right"><p class="text-xl font-bold text-green-600">$${pedido.total.toFixed(2)}</p><p class="text-xs text-gray-500">Total</p></div>
                        <div class="flex flex-col gap-2">
                            <button onclick="event.stopPropagation(); confirmarEliminarPedido(${pedido.id})" class="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-full transition-colors" title="Eliminar pedido"><i class="ph ph-trash text-lg"></i></button>
                            <i id="icono-${pedidoId}" class="ph ph-caret-down text-gray-400 text-xl transition-transform duration-200"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div id="contenido-${pedidoId}" class="acordeon-contenido hidden">
                <div class="border-t border-gray-200">
                    <div class="p-4 bg-gray-50">
                        <h4 class="font-semibold text-gray-800 mb-3 flex items-center gap-2"><i class="ph ph-list text-lg"></i> Productos del pedido</h4>
                        <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">${productosHTML}</div>
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

        // Añade el acordeón del pedido a la lista.
        pedidosLista.appendChild(pedidoDiv);
    });
}

/**
 * Muestra u oculta el contenido de un acordeón de pedido.
 * @param {string} pedidoId - El ID del pedido (ej. 'pedido-12345').
 */
function toggleAcordeon(pedidoId) {
    // Obtiene el elemento de contenido y el ícono del acordeón.
    const contenido = document.getElementById(`contenido-${pedidoId}`);
    const icono = document.getElementById(`icono-${pedidoId}`);

    if (!contenido || !icono) return; // Si no existen, termina.

    // Comprueba si el contenido está actualmente oculto.
    const isHidden = contenido.classList.contains('hidden');

    // Cierra todos los demás acordeones para que solo uno esté abierto a la vez.
    document.querySelectorAll('.acordeon-contenido').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('[id^="icono-pedido-"]').forEach(el => el.classList.remove('rotate-180'));

    // Si el acordeón seleccionado estaba cerrado, lo abre.
    if (isHidden) {
        contenido.classList.remove('hidden');
        icono.classList.add('rotate-180'); // Rota el ícono de la flecha.
    }
}

/**
 * Pide confirmación al usuario antes de eliminar un pedido específico.
 * @param {number} pedidoId - El ID del pedido a eliminar.
 */
function confirmarEliminarPedido(pedidoId) {
    // Busca el pedido en el array de pedidos realizados.
    const pedido = pedidosRealizados.find(p => p.id === pedidoId);
    if (!pedido) {
        console.error('Pedido no encontrado:', pedidoId);
        return;
    }

    // Muestra una ventana de confirmación con los detalles del pedido.
    const confirmar = confirm(
        `¿Estás seguro de que deseas eliminar el pedido #${pedidoId}?\n\n` +
        `Fecha: ${pedido.fecha}\n` +
        `Total: $${pedido.total.toFixed(2)}\n` +
        `Productos: ${pedido.productos.length}\n\n` +
        `Esta acción no se puede deshacer.`
    );

    // Si el usuario confirma, llama a la función de eliminación.
    if (confirmar) {
        eliminarPedido(pedidoId);
    }
}

/**
 * Elimina un pedido específico del historial.
 * @param {number} pedidoId - El ID del pedido a eliminar.
 */
function eliminarPedido(pedidoId) {
    // Encuentra el índice del pedido en el array.
    const indice = pedidosRealizados.findIndex(p => p.id === pedidoId);

    if (indice === -1) {
        console.error('Pedido no encontrado para eliminar:', pedidoId);
        return;
    }

    // Elimina el pedido del array.
    pedidosRealizados.splice(indice, 1);

    // Guarda los cambios en localStorage.
    guardarPedidosEnStorage();

    // Vuelve a renderizar la vista de "Mis Pedidos".
    mostrarMisPedidos();

    // Muestra un mensaje de confirmación.
    alert('El pedido ha sido eliminado exitosamente.');
}

/**
 * Pide confirmación al usuario antes de eliminar todo el historial de pedidos.
 */
function confirmarLimpiarTodosPedidos() {
    // Calcula el número total de pedidos y el gasto total.
    const totalPedidos = pedidosRealizados.length;
    const totalGastado = pedidosRealizados.reduce((sum, pedido) => sum + pedido.total, 0);

    // Muestra una ventana de confirmación con los detalles.
    const confirmar = confirm(
        `¿Estás seguro de que deseas eliminar TODO el historial de pedidos?\n\n` +
        `Se eliminarán ${totalPedidos} pedidos\n` +
        `Total gastado: $${totalGastado.toFixed(2)}\n\n` +
        `Esta acción no se puede deshacer.`
    );

    // Si el usuario confirma, llama a la función de limpieza.
    if (confirmar) {
        limpiarTodosPedidos();
    }
}

/**
 * Limpia todo el historial de pedidos del usuario.
 */
function limpiarTodosPedidos() {
    // Vacía el array de pedidos.
    pedidosRealizados = [];
    // Guarda el estado vacío en localStorage.
    guardarPedidosEnStorage();
    // Vuelve a renderizar la vista de "Mis Pedidos" (que ahora mostrará el mensaje de vacío).
    mostrarMisPedidos();
    // Muestra un mensaje de confirmación.
    alert('Todo el historial de pedidos ha sido eliminado exitosamente.');
}


/**
 * =============================================================
 * INICIALIZACIÓN Y EVENT LISTENERS PRINCIPALES
 * =============================================================
 */

/**
 * Configura el event listener para el botón "Finalizar Compra" en el panel del carrito.
 */
function configurarBotonFinalizarCompra() {
    // Se definen varios selectores para intentar encontrar el botón, ya que su estructura puede variar.
    const selectors = [
        'button:contains("Finalizar Compra")',
        '.border-t button',
        '#carrito .border-t button',
        'button[class*="bg-red-600"][class*="w-full"]'
    ];

    let finalizarCompraBtn = null;

    // Intenta encontrar el botón buscando por su texto.
    const botones = document.querySelectorAll('button');
    botones.forEach(btn => {
        if (btn.textContent.includes('Finalizar Compra')) {
            finalizarCompraBtn = btn;
        }
    });

    // Si no se encuentra, busca específicamente dentro del panel del carrito.
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

    // Si se encontró el botón.
    if (finalizarCompraBtn) {
        console.log('Botón Finalizar Compra encontrado:', finalizarCompraBtn);
        // Elimina cualquier listener previo para evitar ejecuciones múltiples.
        finalizarCompraBtn.removeEventListener('click', abrirModalConfirmacion);
        // Agrega el listener para abrir el modal de confirmación de compra.
        finalizarCompraBtn.addEventListener('click', abrirModalConfirmacion);
    } else {
        // Advierte en consola si el botón no pudo ser encontrado.
        console.warn('No se pudo encontrar el botón Finalizar Compra');
    }
}

/**
 * Evento que se dispara cuando el contenido del DOM ha sido completamente cargado.
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado, inicializando...');

    // Carga los datos iniciales desde localStorage y la API.
    cargarCarritoDesdeStorage();
    cargarPedidosDesdeStorage();
    cargarProductos();

    // Configura el botón "Finalizar Compra" con un pequeño retardo para asegurar que el DOM esté listo.
    setTimeout(() => {
        configurarBotonFinalizarCompra();
    }, 100);

    // Comprueba el estado de la sesión para actualizar la UI.
    actualizarEstadoSesion();

    console.log('Inicialización completada');
    console.log('Pedidos realizados:', pedidosRealizados); // Útil para depuración.

    // Configura el campo de búsqueda de productos.
    const inputBusqueda = document.getElementById('input-busqueda');
    if (inputBusqueda) {
        inputBusqueda.addEventListener('input', () => {
            const texto = inputBusqueda.value.trim().toLowerCase();

            // Si el campo de búsqueda está vacío, muestra los productos de la categoría activa.
            if (texto === '') {
                mostrarProductos(todosLosProductos, categoriaActiva);
                return;
            }

            // Filtra los productos cuyo título incluya el texto de búsqueda.
            const productosFiltrados = todosLosProductos.filter(producto =>
                producto.title.toLowerCase().includes(texto)
            );

            // Muestra los productos filtrados.
            mostrarProductos(productosFiltrados, 'todos');
        });
    }

    // Configura el menú desplegable para ordenar productos.
    const selectOrden = document.getElementById('ordenar-productos');
    if (selectOrden) {
        selectOrden.addEventListener('change', () => {
            // Llama a la función de ordenamiento cada vez que cambia la selección.
            aplicarOrdenamiento();
        });
    }
});

/**
 * Ordena y muestra los productos según el criterio seleccionado en el menú desplegable.
 */
function aplicarOrdenamiento() {
    const selectOrden = document.getElementById('ordenar-productos');
    const valor = selectOrden.value; // Obtiene el valor seleccionado (ej. 'precio-asc').
    // Crea una copia de los productos para no modificar el array original.
    let productosOrdenados = [...todosLosProductos];

    if (valor === 'precio-asc') {
        // Ordena por precio de menor a mayor.
        productosOrdenados.sort((a, b) => a.price - b.price);
    } else if (valor === 'precio-desc') {
        // Ordena por precio de mayor a menor.
        productosOrdenados.sort((a, b) => b.price - a.price);
    } else if (valor === 'nombre-asc') {
        // Ordena alfabéticamente por título (A-Z).
        productosOrdenados.sort((a, b) => a.title.localeCompare(b.title));
    } else if (valor === 'nombre-desc') {
        // Ordena alfabéticamente por título en orden inverso (Z-A).
        productosOrdenados.sort((a, b) => b.title.localeCompare(a.title));
    }

    // Muestra los productos ya ordenados, respetando la categoría activa.
    mostrarProductos(productosOrdenados, categoriaActiva);
}