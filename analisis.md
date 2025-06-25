# 📝 Análisis del Proyecto: World Wide Shop

Este documento detalla las decisiones clave tomadas en el diseño de la interfaz y experiencia de usuario (UI/UX), así como la estructura de datos implementada para la aplicación web "World Wide Shop".

## 🎨 Decisiones de Diseño de Interfaz y Experiencia de Usuario (UI/UX)

El diseño de World Wide Shop se centró en la usabilidad, la claridad visual y una experiencia de compra fluida y moderna, utilizando **Tailwind CSS** para un desarrollo ágil y responsivo.

### 1. Diseño Responsivo

* **Enfoque Mobile-First**: Aunque no se diseñó exclusivamente "mobile-first" en Figma, la implementación con Tailwind CSS facilita la adaptación a diferentes tamaños de pantalla, asegurando que la interfaz sea funcional y atractiva en dispositivos móviles, tablets y escritorios.
* **Puntos de Quiebre**: Se utilizan los puntos de quiebre predeterminados de Tailwind (`sm`, `md`, `lg`) para ajustar el diseño de la cuadrícula de productos, la visibilidad de elementos (como el texto "Carrito" o "Cuenta" en pantallas pequeñas), y la disposición general de los componentes.
* **Header y Footer Adaptables**: El encabezado y el pie de página están diseñados para reordenar y apilar sus elementos de forma intuitiva en pantallas más pequeñas, manteniendo la accesibilidad a las funciones clave.

### 2. Navegación y Accesibilidad

* **Encabezado Fijo (Sticky Header)**: El `header` permanece visible en la parte superior (`sticky top-0 z-50`), asegurando que el logo, la barra de búsqueda y los accesos principales (Cuenta, Registro, Carrito) estén siempre disponibles, mejorando la navegación.
* **Barra de Búsqueda Integrada**: La barra de búsqueda está ubicada prominentemente en el encabezado, permitiendo a los usuarios buscar productos rápidamente desde cualquier página.
* **Categorización y Filtrado Claros**:
    * **Menú de Navegación**: Las categorías principales (Electrónica, Joyería, Ropa) y secciones como "Destacados" y "Mis Pedidos" son accesibles directamente desde la barra de navegación. El menú de "Ropa" utiliza un `dropdown` (`group-hover:opacity-100`) para subcategorías, manteniendo la interfaz limpia.
    * **Botones de Filtro por Categoría**: En la sección de productos, los botones (`px-3 py-1 bg-gray-200`) permiten un filtrado rápido por categoría, complementando el menú de navegación para una interacción más directa.
    * **Ordenamiento**: Un `select` para ordenar productos por precio (menor a mayor, mayor a menor) y nombre (A-Z, Z-A) mejora la experiencia de exploración, permitiendo a los usuarios organizar el contenido según sus preferencias.
* **Visualización de Productos**:
    * **Tarjetas de Producto**: Cada producto se muestra en una tarjeta individual (`bg-white rounded-lg shadow-md`), facilitando la lectura y la interacción. Incluyen imagen, título, precio, calificación (estrellas y recuento), y categoría.
    * **Feedback Visual "Agregar al Carrito"**: Al añadir un producto al carrito, el botón cambia de texto a "¡Agregado!" y de color a verde (`bg-green-600`), proporcionando una confirmación instantánea al usuario.
* **Iconografía (Phosphor Icons)**: El uso de Phosphor Icons (`<i class="ph ph-..."></i>`) proporciona señales visuales claras y consistentes en toda la aplicación, mejorando la comprensión y la estética.

### 3. Flujos de Usuario Críticos

* **Modal de Autenticación (Login/Registro)**:
    * El sistema de login y registro se implementa mediante un `modal` (`fixed inset-0 z-50 hidden items-center justify-center`), lo que permite a los usuarios autenticarse sin salir de la página actual, manteniendo el contexto.
    * **Interfaz con Pestañas**: Dentro del modal, se utiliza una interfaz con pestañas (`login-tab`, `register-tab`) para alternar entre los formularios de inicio de sesión y registro, simplificando el proceso y evitando la redundancia de modales.
    * **Social Login**: Botones para iniciar sesión con Facebook y Google se incluyen para ofrecer opciones de autenticación rápidas y convenientes.
* **Carrito de Compras (Panel Lateral)**:
    * El carrito es un `aside` (`fixed right-0 top-0 h-full w-80`) que se desliza desde el lado derecho, permitiendo una visión general de los productos seleccionados sin interrumpir la navegación principal. Es accesible a través de un icono en el encabezado.
    * **Actualización en Tiempo Real**: El contador de artículos (`absolute -top-1 -right-2`) y el total del carrito se actualizan dinámicamente, proporcionando feedback instantáneo al usuario.
    * **Modal de Confirmación de Compra**: Antes de finalizar la compra, se muestra un `modal` de confirmación (`modal-confirmacion`) para evitar compras accidentales y proporcionar un resumen final del pedido, mejorando la seguridad y la confianza del usuario.
* **Historial de Pedidos (Acordeón)**:
    * La sección "Mis Pedidos" (`mis-pedidos`) muestra un historial detallado de las compras, accesible desde la navegación principal.
    * **Diseño de Acordeón**: Cada pedido se presenta en un componente de `acordeón` (`acordeon-contenido hidden`), lo que permite a los usuarios expandir y contraer los detalles del pedido, manteniendo la interfaz ordenada, especialmente para usuarios con muchos pedidos.
    * **Resumen y Acciones**: Un encabezado resumen (`bg-gradient-to-r`) muestra el total de pedidos y el dinero gastado. Se incluye una opción para "Limpiar todo el historial", con una confirmación para prevenir eliminaciones accidentales.

### 4. Estética y Coherencia Visual

* **Paleta de Colores**: Se utilizan colores corporativos (negro, blanco, amarillo, rojo para acciones) para crear una identidad visual coherente. Los botones de acción (`bg-red-600`) y los acentos (`text-yellow-400`) guían al usuario hacia los elementos interactivos clave.
* **Tipografía y Espaciado**: Se presta atención a la legibilidad de la tipografía y a un espaciado adecuado entre los elementos (`gap-`, `py-`, `px-` en Tailwind) para reducir el desorden visual y mejorar la legibilidad.
* **Transiciones y Animaciones**: Se aplican transiciones suaves (`transition-colors`, `transition-transform`) en elementos interactivos como botones y enlaces para proporcionar una respuesta visual agradable al usuario.

## 📊 Estructura de Datos

La aplicación gestiona los datos de los productos, el carrito de compras, los usuarios y el historial de pedidos utilizando JavaScript y la persistencia en `localStorage`.

### 1. Productos

* **`todosLosProductos` (Array Global)**:
    * Almacena todos los productos obtenidos de la [Fake Store API](https://fakestoreapi.com/products) al cargar la aplicación.
    * Cada objeto de producto contiene propiedades como `id`, `title`, `price`, `image`, `category`, y un objeto `rating` (con `rate` y `count`).
    * **Uso**: Esta estructura permite realizar operaciones de filtrado, búsqueda y ordenamiento sobre el conjunto completo de productos sin necesidad de realizar múltiples solicitudes a la API.

### 2. Carrito de Compras

* **`carrito` (Array Global)**:
    * Representa los productos que el usuario ha añadido a su carrito.
    * Cada elemento en este array es un objeto simplificado del producto, que incluye:
        * `id`: Identificador único del producto.
        * `title`: Nombre del producto.
        * `price`: Precio unitario del producto.
        * `image`: URL de la imagen del producto.
        * `cantidad`: Cantidad de ese producto en el carrito.
    * **Persistencia**: El array `carrito` se guarda en `localStorage` bajo la clave `'carrito'` (`localStorage.setItem('carrito', JSON.stringify(carrito))`). Al cargar la página, el carrito se inicializa con los datos almacenados si existen (`localStorage.getItem('carrito')`).
    * **Justificación**: Se opta por almacenar solo los datos esenciales del producto en el carrito para mantener la información ligera y facilitar la persistencia. La cantidad se maneja como una propiedad del objeto para permitir la agrupación de productos idénticos.

### 3. Usuarios y Sesión

* **`usuarios` (Array en localStorage)**:
    * Almacena un array de objetos de usuario registrados.
    * Cada objeto de usuario contiene: `nombre`, `email`, y `password`.
    * **Persistencia**: Guardado en `localStorage` bajo la clave `'usuarios'`.
    * **Justificación**: Permite simular un sistema de registro y login básico para el propósito del proyecto académico.
* **`usuarioActual` (Objeto en localStorage)**:
    * Almacena la información del usuario que está actualmente logeado en la sesión.
    * **Persistencia**: Guardado en `localStorage` bajo la clave `'usuarioActual'`.
    * **Justificación**: Permite mantener la sesión del usuario persistente a través de las recargas de página, ofreciendo una experiencia de usuario continua.

### 4. Pedidos (Historial de Compras)

* **`pedidosRealizados` (Array Global)**:
    * Almacena los pedidos completados por el usuario actualmente logeado.
    * Cada objeto de pedido incluye:
        * `id`: Un identificador único del pedido (generado con `Date.now()`).
        * `fecha`: Fecha en que se realizó el pedido.
        * `productos`: Un array con los productos que formaban parte de ese pedido (similar a la estructura del carrito en el momento de la compra).
        * `total`: El monto total del pedido.
* **`pedidosPorUsuario` (Objeto en localStorage)**:
    * Este es el contenedor principal para el historial de pedidos de todos los usuarios.
    * Es un objeto donde cada clave es el `email` de un usuario y su valor es un array de objetos `pedidosRealizados` asociados a ese usuario.
    * **Persistencia**: Guardado en `localStorage` bajo la clave `'pedidosPorUsuario'`.
    * **Justificación**: Permite mantener un historial de pedidos separado para cada usuario registrado, ofreciendo una funcionalidad más robusta para un entorno multiusuario. Al iniciar sesión, se cargan los pedidos específicos del `usuarioActual` en `pedidosRealizados`, y al cerrar sesión, se limpian para ese usuario y la sección de "Mis Pedidos" se oculta.

### 5. Persistencia General (`localStorage`)

* **Ventajas**: `localStorage` se utiliza por su simplicidad para proyectos de cliente (`frontend`) que no requieren un `backend` complejo. Permite mantener el estado del carrito, la sesión del usuario y el historial de pedidos incluso después de cerrar y reabrir el navegador.
* **Manejo de Errores**: Se incluyen bloques `try-catch` al cargar y guardar datos en `localStorage` para manejar posibles errores de cuota o parseo, mejorando la robustez de la aplicación.

## Justificación de los Filtros y Ordenamientos (Usabilidad)

Los filtros y las opciones de ordenamiento no son meras adiciones funcionales; son herramientas cruciales que empoderan al usuario, mejoran la eficiencia de la búsqueda y, en última instancia, optimizan la experiencia de compra. Su implementación en World Wide Shop se justifica por los siguientes principios de usabilidad:

- **Eficiencia en la Búsqueda y Reducción de la Carga Cognitiva:**

    - **Filtrado por Categoría (Electrónica, Joyería, Ropa, Destacados):** Permite a los usuarios reducir rápidamente el número de productos visibles, centrándose solo en aquellos que son relevantes para sus intereses. En un catálogo extenso, ver todos los productos puede ser abrumador. Al categorizar, se disminuye la carga cognitiva, facilitando que el usuario encuentre lo que busca sin sentirse saturado. Por ejemplo, un usuario interesado solo en electrónica no necesita desplazarse por cientos de prendas de vestir.

    - **Búsqueda por Título (input-busqueda):** Ofrece una forma directa y rápida de encontrar un producto específico o similar. Esto es vital cuando el usuario ya tiene una idea clara de lo que quiere comprar, evitando la necesidad de navegar por categorías. La búsqueda en tiempo real mejora la inmediatez y la satisfacción.

- **Flexibilidad y Control del Usuario:**

    - **Ordenamiento por Precio (Ascendente/Descendente):** Atiende a diferentes intenciones de compra. Un usuario con un presupuesto limitado preferirá ordenar por precio ascendente para ver las opciones más económicas primero, mientras que uno que busca productos de alta gama podría preferir el descendente. Esto da control total sobre cómo se presenta la información de precios, que es un factor decisivo en la compra.

    - **Ordenamiento por Nombre (A-Z/Z-A):** Es útil para la navegación alfabética cuando el usuario no recuerda el precio o la categoría exacta, pero sí una parte del nombre. Facilita la exploración sistemática del catálogo.

- **Mejora de la Experiencia de Descubrimiento:**

    - **Filtro "Destacados" (Productos con 4+ Estrellas):** Este filtro no solo reduce el número de productos, sino que también guía al usuario hacia artículos de alta calidad o populares. Desde una perspectiva de usabilidad, esto es un atajo para el "descubrimiento de valor", ayudando a los usuarios indecisos a encontrar productos bien valorados por otros compradores, lo que puede influir positivamente en su decisión de compra y generar confianza.

- **Navegación Intuitiva y Familiaridad:**

    - La ubicación prominente de los filtros (barra lateral o encima de la cuadrícula de productos) y las opciones de ordenamiento (dropdown) sigue patrones de diseño web comunes y esperados en plataformas de comercio electrónico. Esto reduce la curva de aprendizaje y hace que la interfaz sea familiar y fácil de usar para cualquier persona que haya interactuado con una tienda online.

En resumen, los filtros y ordenamientos en World Wide Shop no solo son funcionalidades, sino que son componentes esenciales de una buena usabilidad que permiten a los usuarios navegar, encontrar y tomar decisiones de compra de manera más eficiente, satisfactoria y con un mayor sentido de control.